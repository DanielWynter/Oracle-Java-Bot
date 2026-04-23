package com.springboot.MyTodoList;

import com.springboot.MyTodoList.config.BotProps;
import com.springboot.MyTodoList.config.DeepSeekConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Import;

import java.nio.file.Paths;

@SpringBootApplication
@EnableConfigurationProperties(BotProps.class)
@Import(DeepSeekConfig.class)
public class MyTodoListApplication {

	public static void main(String[] args) {
		String walletDir = Paths.get("wallet").toAbsolutePath().toString();
		System.setProperty("oracle.net.tns_admin", walletDir);
		System.setProperty("oracle.net.wallet_location",
				"(SOURCE=(METHOD=FILE)(METHOD_DATA=(DIRECTORY=" + walletDir + ")))");
		SpringApplication.run(MyTodoListApplication.class, args);
	}

}
