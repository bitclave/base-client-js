pipeline {
    environment {
        // CI = 'true' 
        // PROJECT = "bitclave-jenkins-ci"
        PROJECT = "bitclave-base"
        APP_NAME = "base-client-js"
        FE_SVC_NAME = "${APP_NAME}-frontend"
        CLUSTER = "base-first"
        CLUSTER_ZONE = "us-central1-f"
        // BRANCH_NAME = "master"
        IMAGE_TAG = "gcr.io/bitclave-jenkins-ci/${APP_NAME}:${env.BRANCH_NAME}.${env.BUILD_NUMBER}"
        BUILDER_IMAGE_TAG = "gcr.io/bitclave-jenkins-ci/base-client-js-builder"
        JENKINS_CRED = "bitclave-jenkins-ci"
    }
    agent {
    kubernetes {
      label 'jenkins-builder'
      defaultContainer 'jnlp'
      yaml """
apiVersion: v1
kind: Pod
metadata:
labels:
  component: ci
spec:
  # Use service account that can deploy to all namespaces
  serviceAccountName: cd-jenkins
  containers:
  - name: nodejs
    image: gcr.io/bitclave-jenkins-ci/base-client-js-builder
    command:
    - cat
    tty: true
  - name: gcloud
    image: gcr.io/cloud-builders/gcloud
    command:
    - cat
    tty: true
  - name: kubectl
    image: gcr.io/cloud-builders/kubectl
    command:
    - cat
    tty: true
"""
        }
    }
    
    stages {
        stage('Build') { 
            steps {
                container("nodejs") {
                    sh "npm install"
                    sh "npm run build"
                }
            }
        }
        stage('Test') { 
            steps {
                container("nodejs") {
                    sh 'node ./external/Signer.js --authPK 02e2d9c04891bf7f9934041d7171ade343e540f5d18bd357cde4ef175da3de7e06 --host https://base2-bitclva-com.herokuapp.com &'
                    sh 'npm test' 
                }
            }
        }

        // stage('Deploy Production') {
        // // Production branch
        // steps{
        //     // sh("echo here1")
        //     container('kubectl') {
        //       // Change deployed image in production to the one we just built
        //       sh("echo here2")
        //       sh("gcloud config get-value account")
        //       // sh("gcloud container clusters list")
        //       // sh("gcloud container clusters get-credentials jenkins-cd --zone=us-central1-f")
        //       // sh("gcloud container clusters list")
        //       // sh("kubectl config current-context")
        //       // sh("gcloud container clusters get-credentials base-first --zone us-central1-f --project bitclave-jenkins-ci")
        //       // sh("gcloud config get-value account")
        //       sh("sed -i.bak 's#gcr.io/cloud-solutions-images/gceme:1.0.0#gcr.io/bitclave-jenkins-ci/my-app:master.26#' ./k8s/production/*.yaml")
        //       sh("echo here3")
        //       // sh("kubectl cluster-info")
        //       step([$class: 'KubernetesEngineBuilder',namespace:'production', projectId: env.PROJECT, clusterName: env.CLUSTER, zone: env.CLUSTER_ZONE, manifestPattern: 'k8s/services', credentialsId: env.JENKINS_CRED, verifyDeployments: false])
        //       step([$class: 'KubernetesEngineBuilder',namespace:'production', projectId: env.PROJECT, clusterName: env.CLUSTER, zone: env.CLUSTER_ZONE, manifestPattern: 'k8s/production', credentialsId: env.JENKINS_CRED, verifyDeployments: false])
        //       sleep 10 // seconds
        //       sh("gcloud container clusters get-credentials base-first --zone us-central1-f --project bitclave-base")
        //       sh("echo `kubectl --namespace=production get service/${FE_SVC_NAME} -o jsonpath='{.status.loadBalancer.ingress[0].ip}'`")
        //     }
        //   }
        // }
        // stage ('Time to access the app') {
        //   steps {
        //     echo 'Waiting 3 minutes for deployment to complete prior starting smoke testing'
        //     sleep 100 // seconds
        //   }
        // }
        // stage('Cleanup Production') {
        //     // Production branch
        //     steps{
        //     // sh("echo here1")
        //     container('kubectl') {
        //       sh("gcloud container clusters get-credentials base-first --zone us-central1-f --project bitclave-base")
        //       sh("kubectl delete -n production services my-app-backend my-app-frontend")
        //       sh("kubectl delete -n production deployment my-app-backend-production my-app-frontend-production")
        //     }
        //   }
        // }
        // stage('Deliver') { 
        //     steps {
        //         container('nodejs') {
        //             sh './jenkins/scripts/deliver.sh' 
        //             input message: 'Finished using the web site? (Click "Proceed" to continue)' 
        //             sh './jenkins/scripts/kill.sh' 
        //         }
        //     }
        // }
    }
}
