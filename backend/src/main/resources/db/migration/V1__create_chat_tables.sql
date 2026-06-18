CREATE TABLE chat_rooms (
    id BIGINT NOT NULL AUTO_INCREMENT,
    reservation_id BIGINT NOT NULL,
    participant1_id BIGINT NOT NULL,
    participant2_id BIGINT NOT NULL,
    last_message_at DATETIME(6) NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_chat_rooms_reservation UNIQUE (reservation_id),
    CONSTRAINT fk_chat_rooms_reservation FOREIGN KEY (reservation_id) REFERENCES reservations (id),
    CONSTRAINT fk_chat_rooms_participant1 FOREIGN KEY (participant1_id) REFERENCES members (id),
    CONSTRAINT fk_chat_rooms_participant2 FOREIGN KEY (participant2_id) REFERENCES members (id)
);

CREATE TABLE chat_messages (
    id BIGINT NOT NULL AUTO_INCREMENT,
    room_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    content VARCHAR(1000) NOT NULL,
    read_at DATETIME(6) NULL,
    created_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_chat_messages_room FOREIGN KEY (room_id) REFERENCES chat_rooms (id),
    CONSTRAINT fk_chat_messages_sender FOREIGN KEY (sender_id) REFERENCES members (id),
    CONSTRAINT fk_chat_messages_receiver FOREIGN KEY (receiver_id) REFERENCES members (id)
);

CREATE INDEX idx_chat_messages_room_created_id ON chat_messages (room_id, created_at, id);
CREATE INDEX idx_chat_messages_room_receiver_read ON chat_messages (room_id, receiver_id, read_at);
