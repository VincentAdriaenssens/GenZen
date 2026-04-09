package fr.but3.genzen;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import fr.but3.genzen.dto.CreateUserRequest;
import fr.but3.genzen.dto.UserResponse;
import fr.but3.genzen.service.UserService;

@SpringBootTest
class UserControllerIntegrationTest {

    @Autowired
    private UserService userService;

    @Test
    void addChildByParentEmailShouldWork() {
        long suffix = System.currentTimeMillis();
        String parentEmail = "parent." + suffix + "@genzen.local";
        String childEmail = "enfant." + suffix + "@genzen.local";

        UserResponse parent = userService.registerParent(new CreateUserRequest(parentEmail, "parent123"));
        assertNotNull(parent.id());
        assertTrue(parent.parent());

        UserResponse child = userService.addChild(parentEmail, new CreateUserRequest(childEmail, "enfant123"));
        assertNotNull(child.id());
        assertEquals(childEmail, child.email());
        assertFalse(child.parent());
    }
}
