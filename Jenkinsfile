/* import shared library */
@Library('shared-library')_

pipeline {
    agent any
    environment {
        //be sure to replace "sampriyadarshi" with your own Docker Hub username
        DOCKER_IMAGE_NAME = "firasdotcom/mybackend"
    }
    stages {
        stage('Build') {
            steps {
                echo 'Running build automation'
                sh 'node install'
                // archiveArtifacts artifacts: 'dist/trainSchedule.zip'
            }
        }
        stage('Build Docker Image') {
            when {
                branch 'master'
            }
            steps {
                script {
                    app = docker.build(DOCKER_IMAGE_NAME)
                    app.inside {
                        sh 'echo Hello, World!'
                    }
                }
            }
        }
        stage('Push Docker Image') {
            when {
                branch 'master'
            }
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker_hub_login') {
                        app.push("${env.BUILD_NUMBER}")
                        app.push("latest")
                    }
                }
            }
        }
        
        stage('DeployToProduction') {
            when {
                branch 'master'
            }
            steps {
                milestone(1)
                kubernetesDeploy(
                    kubeconfigId: 'kubeconfig',
                    configs: 'deploy.yml',
                    enableConfigSubstitution: true
                )
            }
        }
    }
}