package hu.ibc.ibcpartners.notification.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String from;

    public void sendEmail(String to, EmailTemplate template, Map<String, Object> params) {
        log.info("Sending email to {}, {}", to, template);

        Context context = new Context();
        params.forEach(context::setVariable);

        String html = templateEngine.process("email/" + template.name().toLowerCase() + ".html", context);

        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(template.getSubject());
            helper.setText(html, true);
            helper.setFrom(from, "myIBC");
            helper.setReplyTo("no-reply@myibc.hu");
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Email küldés sikertelen", e);
        }
    }
}
