pipeline {
  environment {
    registry = "sa-saopaulo-1.ocir.io/groavogpbneu/"
    repository = "app-jenkins"
    dockerImageTag = ""
  }
  agent { label 'kaniko'}
  stages {
    stage('Checkout Source') {
      steps {
        git credentialsId: 'github_paguemenos', url: 'https://github.com/opsteamhub/app-jenkins.git', branch: 'staging'               
      }
    }
    stage('Build and Push Image with Kaniko') {
      environment {
        version = """${sh (script: 'cat package.json | grep version | head -1 | awk -F: \'{ print $2 }\' | sed \'s/[",]//g\'', returnStdout: true)}""" 
      }
      steps {
        script {
          dockerImageTag = "staging${version.trim()}"
        }
        container(name: 'kaniko') {
          sh '''
          /kaniko/executor --dockerfile `pwd`/Dockerfile \
              --context `pwd` \
              --destination ${registry}${repository}:${dockerImageTag} \
              --insecure --skip-tls-verify
          '''
        }
      }
    }
    stage('Deploy App') {
      steps {
        script {
          kubernetesDeploy(configs: repository + ".yaml", kubeconfigId: "kubeconfig_homolog")
        }
      }
    }
  }
}
