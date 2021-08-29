package com.florian935.rsocketserver.controller;

import com.florian935.rsocketserver.domain.Product;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Mono;

@Controller
public class ProductController {

    @MessageMapping("request.response")
    Mono<Product> requestResponse(@Payload Product product) {

        return Mono.just(product);
    }
}
