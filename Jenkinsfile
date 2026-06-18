pipeline {
    agent any

    environment {
        IMAGE_NAME = "wanderlust"
        IMAGE_TAG = "latest"
    }

    stages {

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Security Scan') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    bat 'npm audit --audit-level=high'
                }
            }
        }

        stage('Application Check') {
            steps {
                bat 'node --version'
                bat 'npm --version'
                bat 'node --check app.js'
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker build -t %IMAGE_NAME%:%IMAGE_TAG% .'
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {

                    bat '''
                    docker login -u %DOCKER_USER% -p %DOCKER_PASS%
                    if errorlevel 1 exit /b 1

                    docker tag %IMAGE_NAME%:%IMAGE_TAG% %DOCKER_USER%/%IMAGE_NAME%:%IMAGE_TAG%
                    if errorlevel 1 exit /b 1

                    docker push %DOCKER_USER%/%IMAGE_NAME%:%IMAGE_TAG%
                    if errorlevel 1 exit /b 1

                    docker logout
                    '''
                }
            }
        }

        stage('Success') {
            steps {
                echo '========================================='
                echo ' Wanderlust Docker Image Uploaded!'
                echo ' Image : %IMAGE_NAME%:%IMAGE_TAG%'
                echo ' Docker Hub Push Successful!'
                echo '========================================='
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }

        unstable {
            echo 'Pipeline completed with security warnings (npm audit).'
        }

        failure {
            echo 'Pipeline failed. Check Jenkins Console Output.'
        }

        always {
            cleanWs()
        }
    }
}