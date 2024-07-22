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
      environment {
        version = sh(script: "cat package.json | grep version | head -1 | awk -F: '{ print \$2 }' | sed 's/[\",]//g'", returnStdout: true).trim()
      }
      steps {
        container('kaniko') {
          sh '''#!/bin/bash
          executor --context $WORKSPACE --dockerfile $WORKSPACE/Dockerfile --destination ${registry}/${repository}:staging${version}
          '''
        }
      }
    }
    stage('Push Image') {
      agent { label 'kaniko' }
      steps {
        script {
          docker.withRegistry('https://sa-saopaulo-1.ocir.io', 'ocirsecret') {
            dockerImage = docker.build("${registry}/${repository}:staging${version}")
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
