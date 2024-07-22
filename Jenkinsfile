pipeline {
  environment {
    registry = "sa-saopaulo-1.ocir.io/groavogpbneu/"
    repository = "api-portalcrm"
    dockerImage = ""
  }
  agent { label 'kaniko'}
  stages {
    stage('Checkout Source') {
      steps {
        git credentialsId: 'github_paguemenos', url: 'https://github.com/paguemenos/api-portalcrm.git', branch: 'staging'               
      }
    }
    stage('Build and push to registry') {
      agent { label 'kaniko' }
      environment {
        version = """${sh (script: 'cat package.json | grep version | head -1 | awk -F: \'{ print $2 }\' | sed \'s/[",]//g\'', returnStdout: true)}""" 
      }
      steps {
          container('kaniko') {
              sh '''executor \
                    --destination="${registry}${repository}:staging${version.trim()}"
                    --context=$WORKSPACE
              '''
      }
    }
    
    stage('Push Image') {
      agent { label 'kaniko' }
      steps {
        script {
          docker.withRegistry('https://sa-saopaulo-1.ocir.io', 'ocirsecret') {
            dockerImage.push()
          }
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