pipeline {
  environment {
    registry = "faelvinicius"
    repository = "app-jenkins"
    dockerImage = ""
  }
  agent any
  stages {
    stage('Checkout Source') {
      steps {
        git credentialsId: 'github_paguemenos', url: 'https://github.com/opsteamhub/app-jenkins.git', branch: 'main'
      }
    }
    stage('Build image') {
      agent { label 'kaniko' }
      steps {
        script {
          // Captura a versão do package.json
          def version = sh(script: "cat package.json | grep version | head -1 | awk -F: '{ print \$2 }' | sed 's/[\",]//g'", returnStdout: true).trim()
          
          // Constrói a imagem Docker usando Kaniko
          sh '''
            /kaniko/executor --context $WORKSPACE --dockerfile $WORKSPACE/Dockerfile --destination ${registry}/${repository}:staging${version}
          '''
          
          // Define a variável dockerImage
          dockerImage = "${registry}/${repository}:staging${version}"
        }
      }
    }
    stage('Push Image') {
      agent { label 'kaniko' }
      steps {
        script {
          // Autentica no Docker registry e realiza o push da imagem
          sh "docker login -u <seu-usuario> -p <sua-senha> https://sa-saopaulo-1.ocir.io"
          sh "docker push ${dockerImage}"
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
