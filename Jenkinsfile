pipeline {
  agent any
  stages {
    stage('install') {
      parallel {
        stage('install') {
          steps {
            sh 'npm install'
          }
        }
        stage('Test') {
          steps {
            sh 'npm test'
          }
        }
      }
    }
  }
}