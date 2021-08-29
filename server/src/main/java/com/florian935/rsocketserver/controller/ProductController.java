package com.florian935.rsocketserver.controller;

import com.florian935.rsocketserver.domain.Product;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Mono;

@Controller
@Slf4j
public class ProductController {

    @MessageMapping("request.response")
    Mono<Product> requestResponse(@Payload Product product) {

        return Mono.just(product);
    }

    @MessageMapping("fire.and.forget")
    Mono<Void> fireAndForget(@Payload String greeting) {

      log.info(greeting);

      return Mono.empty();
    }
}
