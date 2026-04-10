FROM openjdk:17
EXPOSE 8080
ADD target/lab12026.jar lab12026.jar
ENTRYPOINT ["java","-jar","/lab12026.jar"]