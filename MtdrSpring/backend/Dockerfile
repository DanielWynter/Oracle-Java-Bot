FROM openjdk:22-jdk
#COPY pom.xml /tmp/
#COPY src /tmp/src/
WORKDIR /tmp/
COPY wallet /tmp/wallet
EXPOSE 8080
COPY target/MyTodoList-0.0.1-SNAPSHOT.jar MyTodoList.jar
ENTRYPOINT ["java","-jar","MyTodoList.jar"]