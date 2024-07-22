pipeline {
    agent { label 'kaniko'}

    stages {
        stage('Build and push to registry') {
            steps {
                container('kaniko') {
                    sh '''executor \
                          --destination=docker.io/faelvinicius/app-jenkins:$(date -u +%Y-%m-%dT%H%M%S) \
                          --context=$WORKSPACE
                    '''
                }
            }
        }
    }
}