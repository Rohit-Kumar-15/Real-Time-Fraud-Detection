FROM openjdk:21-jdk-slim

# Set working directory
WORKDIR /app

# Copy the Maven project files
COPY pom.xml .
COPY src ./src

# Install Maven and build the application
RUN apt-get update && apt-get install -y maven && mvn clean package -DskipTests

# Copy the ONNX model
COPY ml_model ./ml_model

# Expose the application port
EXPOSE 8080

# Run the Spring Boot application
CMD ["java", "-jar", "target/fraud-detection-backend-1.0.0.jar"]

