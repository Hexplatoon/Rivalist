//package com.hexplatoon.rivalist_backend.config;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.messaging.simp.SimpMessageType;
//import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry;
//import org.springframework.security.config.annotation.web.socket.AbstractSecurityWebSocketMessageBrokerConfigurer;
//
///**
// * Configuration for WebSocket security.
// * Ensures that only authenticated users can access WebSocket endpoints.
// */
//@Configuration
//public class WebSocketSecurityConfig extends AbstractSecurityWebSocketMessageBrokerConfigurer {
//
//    @Override
//    protected void configureInbound(MessageSecurityMetadataSourceRegistry messages) {
//        messages
//            .simpDestMatchers("/app/user.status.*").authenticated()
//            .simpSubscribeDestMatchers("/user/topic/user.status").authenticated()
//            .simpTypeMatchers(SimpMessageType.CONNECT,
//                            SimpMessageType.SUBSCRIBE,
//                            SimpMessageType.DISCONNECT).authenticated()
//            .anyMessage().authenticated();
//    }
//
//    @Override
//    protected boolean sameOriginDisabled() {
//        // Disable CSRF for WebSocket connections
//        return true;
//    }
//}
//
