pipeline {
  environment {
    registry = "sa-saopaulo-1.ocir.io/groavogpbneu/"
    repository = "api-portalcrm"
  }
  agent { label 'kaniko' }
  stages {
    stage('Checkout Source') {
      steps {
        git credentialsId: 'github_paguemenos', url: 'https://github.com/opsteamhub/app-jenkins.git', branch: 'main'
      }
    }
    stage('Build and Push to Registry') {
      environment {
        version = sh(script: "cat package.json | grep version | head -1 | awk -F: '{ print \$2 }' | sed 's/[\",]//g'", returnStdout: true).trim()
      }
      steps {
        container('kaniko') {
          sh """
            executor \
              --destination="${registry}${repository}:staging${version}" \
              --context=$WORKSPACE
          """
        }
      }
    }
    stage('Deploy App') {
      steps {
        script {
          kubernetesDeploy(configs: "${repository}.yaml", kubeconfigId: "kubeconfig_homolog")
        }
      }
    }
  }
}
