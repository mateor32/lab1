FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /build
COPY backend/lab12026/pom.xml ./pom.xml
COPY backend/lab12026/src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app
EXPOSE 8080
COPY --from=build /build/target/lab12026.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]