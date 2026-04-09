package fr.but3.genzen.config;

import jakarta.servlet.Servlet;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class H2ConsoleConfig {

    @Bean
    @ConditionalOnClass(name = "org.h2.server.web.JakartaWebServlet")
    @ConditionalOnProperty(prefix = "spring.h2.console", name = "enabled", havingValue = "true")
    public ServletRegistrationBean<Servlet> h2ServletRegistration() {
        try {
            Class<?> servletClass = Class.forName("org.h2.server.web.JakartaWebServlet");
            Servlet servlet = (Servlet) servletClass.getDeclaredConstructor().newInstance();
            ServletRegistrationBean<Servlet> registration =
                    new ServletRegistrationBean<>(servlet, "/h2-console/*");
            registration.addInitParameter("webAllowOthers", "true");
            registration.addInitParameter("trace", "false");
            return registration;
        } catch (Exception e) {
            throw new IllegalStateException("Impossible d'initialiser la console H2", e);
        }
    }
}
