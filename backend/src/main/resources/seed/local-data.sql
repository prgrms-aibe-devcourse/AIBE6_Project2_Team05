-- =============================================
-- 카테고리 (id 고정)
-- =============================================
INSERT IGNORE INTO categories (id, name) VALUES (1,  '웨딩 사진작가');
INSERT IGNORE INTO categories (id, name) VALUES (2,  '웨딩 영상');
INSERT IGNORE INTO categories (id, name) VALUES (3,  '헤어·메이크업');
INSERT IGNORE INTO categories (id, name) VALUES (4,  '웨딩 플로리스트');
INSERT IGNORE INTO categories (id, name) VALUES (5,  '웨딩 플래너');
INSERT IGNORE INTO categories (id, name) VALUES (6,  '주례·혼례사');
INSERT IGNORE INTO categories (id, name) VALUES (7,  '연주·밴드');
INSERT IGNORE INTO categories (id, name) VALUES (8,  '축가');
INSERT IGNORE INTO categories (id, name) VALUES (9,  '사회자');
INSERT IGNORE INTO categories (id, name) VALUES (10, '기타');

-- =============================================
-- 테스트 회원 (CLIENT / FREELANCER)
-- =============================================
INSERT INTO members (email, password, name, phone, role, status, provider, provider_id, created_at, updated_at)
SELECT
    'test-client@wedge.local',
    '$2a$10$bo9IwOuoBfZPrirjku2kAe6yCeMR6ajU/Nq7uRXeAdMEr8vCj3eye',
    '테스트 커플',
    '010-1111-2222',
    'CLIENT',
    'ACTIVE',
    'LOCAL',
    NULL,
    '2026-06-15 12:00:00',
    '2026-06-15 12:00:00'
WHERE NOT EXISTS (SELECT 1 FROM members WHERE email = 'test-client@wedge.local');

INSERT INTO members (email, password, name, phone, role, status, provider, provider_id, created_at, updated_at)
SELECT
    'test-freelancer@wedge.local',
    '$2a$10$bo9IwOuoBfZPrirjku2kAe6yCeMR6ajU/Nq7uRXeAdMEr8vCj3eye',
    '테스트 프리랜서',
    '010-3333-4444',
    'FREELANCER',
    'ACTIVE',
    'LOCAL',
    NULL,
    '2026-06-15 12:00:00',
    '2026-06-15 12:00:00'
WHERE NOT EXISTS (SELECT 1 FROM members WHERE email = 'test-freelancer@wedge.local');

INSERT INTO members (email, password, name, phone, role, status, provider, provider_id, created_at, updated_at)
SELECT 'freelancer2@wedge.local', '$2a$10$bo9IwOuoBfZPrirjku2kAe6yCeMR6ajU/Nq7uRXeAdMEr8vCj3eye', '김영상', '010-1234-5678', 'FREELANCER', 'ACTIVE', 'LOCAL', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM members WHERE email = 'freelancer2@wedge.local');

INSERT INTO members (email, password, name, phone, role, status, provider, provider_id, created_at, updated_at)
SELECT 'freelancer3@wedge.local', '$2a$10$bo9IwOuoBfZPrirjku2kAe6yCeMR6ajU/Nq7uRXeAdMEr8vCj3eye', '이스냅', '010-2345-6789', 'FREELANCER', 'ACTIVE', 'LOCAL', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM members WHERE email = 'freelancer3@wedge.local');

INSERT INTO members (email, password, name, phone, role, status, provider, provider_id, created_at, updated_at)
SELECT 'freelancer4@wedge.local', '$2a$10$bo9IwOuoBfZPrirjku2kAe6yCeMR6ajU/Nq7uRXeAdMEr8vCj3eye', '박축가', '010-3456-7890', 'FREELANCER', 'ACTIVE', 'LOCAL', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM members WHERE email = 'freelancer4@wedge.local');

INSERT INTO members (email, password, name, phone, role, status, provider, provider_id, created_at, updated_at)
SELECT 'freelancer5@wedge.local', '$2a$10$bo9IwOuoBfZPrirjku2kAe6yCeMR6ajU/Nq7uRXeAdMEr8vCj3eye', '최헤어', '010-4567-8901', 'FREELANCER', 'ACTIVE', 'LOCAL', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM members WHERE email = 'freelancer5@wedge.local');

INSERT INTO members (email, password, name, phone, role, status, provider, provider_id, created_at, updated_at)
SELECT 'freelancer6@wedge.local', '$2a$10$bo9IwOuoBfZPrirjku2kAe6yCeMR6ajU/Nq7uRXeAdMEr8vCj3eye', '정플로리스트', '010-5678-9012', 'FREELANCER', 'ACTIVE', 'LOCAL', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM members WHERE email = 'freelancer6@wedge.local');

INSERT INTO members (email, password, name, phone, role, status, provider, provider_id, created_at, updated_at)
SELECT 'freelancer7@wedge.local', '$2a$10$bo9IwOuoBfZPrirjku2kAe6yCeMR6ajU/Nq7uRXeAdMEr8vCj3eye', '한사회자', '010-6789-0123', 'FREELANCER', 'ACTIVE', 'LOCAL', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM members WHERE email = 'freelancer7@wedge.local');

-- =============================================
-- 프리랜서 프로필
-- =============================================
INSERT INTO freelancer_profiles (member_id, category_id, title, introduction, region, price, career_years, bookmark_count, created_at, updated_at)
SELECT
    (SELECT id FROM members WHERE email = 'test-freelancer@wedge.local' LIMIT 1),
    1,
    '서울 웨딩 스토리텔러',
    '자연스러운 감성과 세련된 구도로 웨딩 순간을 담는 로컬 테스트 프로필입니다.',
    'Seoul',
    850000,
    6,
    12,
    '2026-06-15 12:00:00',
    '2026-06-15 12:00:00'
WHERE NOT EXISTS (
    SELECT 1 FROM freelancer_profiles
    WHERE member_id = (SELECT id FROM members WHERE email = 'test-freelancer@wedge.local' LIMIT 1)
);

INSERT INTO freelancer_profiles (member_id, category_id, title, introduction, region, price, career_years, bookmark_count, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'freelancer2@wedge.local'), 2, '시네마틱 웨딩 영상', '영화같은 웨딩 영상을 제작합니다.', '부산', 800000, 7, 0, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer2@wedge.local'));

INSERT INTO freelancer_profiles (member_id, category_id, title, introduction, region, price, career_years, bookmark_count, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'freelancer3@wedge.local'), 1, '감성 웨딩 사진작가', '자연스러운 순간을 담는 감성 사진 전문가입니다.', '서울', 500000, 5, 0, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer3@wedge.local'));

INSERT INTO freelancer_profiles (member_id, category_id, title, introduction, region, price, career_years, bookmark_count, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'freelancer4@wedge.local'), 8, '감동적인 웨딩 축가', '풍부한 성량으로 하객들의 마음을 울리는 축가 전문가입니다.', '서울', 300000, 4, 0, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer4@wedge.local'));

INSERT INTO freelancer_profiles (member_id, category_id, title, introduction, region, price, career_years, bookmark_count, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'freelancer5@wedge.local'), 3, '헤어·메이크업 아티스트', '청담동 출신 헤어메이크업 전문가입니다.', '서울', 350000, 6, 0, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer5@wedge.local'));

INSERT INTO freelancer_profiles (member_id, category_id, title, introduction, region, price, career_years, bookmark_count, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'freelancer6@wedge.local'), 4, '웨딩 플로리스트', '아름다운 꽃장식으로 웨딩 공간을 화사하게 꾸며드립니다.', '경기', 400000, 8, 0, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer6@wedge.local'));

INSERT INTO freelancer_profiles (member_id, category_id, title, introduction, region, price, career_years, bookmark_count, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'freelancer7@wedge.local'), 9, '전문 웨딩 사회자', '유머와 감동을 살리는 10년 경력의 웨딩 사회자입니다.', '서울', 500000, 10, 0, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer7@wedge.local'));

-- =============================================
-- 포트폴리오 (R2 이미지 사용)
-- =============================================
INSERT INTO portfolios (freelancer_profile_id, image_url, description, sort_order, created_at, updated_at)
SELECT
    (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'test-freelancer@wedge.local' LIMIT 1) LIMIT 1),
    'https://pub-fedc912f591b44f7b17de6206a872ed7.r2.dev/%EB%8D%94%EB%AF%B8%EC%9D%B4%EB%AF%B8%EC%A7%80/%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A46.png',
    '야외 예식의 부드러운 톤을 담은 포트폴리오 샘플입니다.',
    1,
    '2026-06-15 12:00:00',
    '2026-06-15 12:00:00'
WHERE NOT EXISTS (
    SELECT 1 FROM portfolios
    WHERE freelancer_profile_id = (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'test-freelancer@wedge.local' LIMIT 1) LIMIT 1)
      AND sort_order = 1
);

INSERT INTO portfolios (freelancer_profile_id, image_url, description, sort_order, created_at, updated_at)
SELECT
    (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'test-freelancer@wedge.local' LIMIT 1) LIMIT 1),
    'https://pub-fedc912f591b44f7b17de6206a872ed7.r2.dev/%EB%8D%94%EB%AF%B8%EC%9D%B4%EB%AF%B8%EC%A7%80/%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A47.png',
    '실내 예식과 리허설 컷을 가정한 두 번째 포트폴리오 샘플입니다.',
    2,
    '2026-06-15 12:00:00',
    '2026-06-15 12:00:00'
WHERE NOT EXISTS (
    SELECT 1 FROM portfolios
    WHERE freelancer_profile_id = (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'test-freelancer@wedge.local' LIMIT 1) LIMIT 1)
      AND sort_order = 2
);

INSERT INTO portfolios (freelancer_profile_id, image_url, description, sort_order, created_at, updated_at)
SELECT
    (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer2@wedge.local') LIMIT 1),
    'https://pub-fedc912f591b44f7b17de6206a872ed7.r2.dev/%EB%8D%94%EB%AF%B8%EC%9D%B4%EB%AF%B8%EC%A7%80/cut_01.png',
    '시네마틱한 감성으로 담은 웨딩 영상 대표 컷입니다.',
    1, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM portfolios
    WHERE freelancer_profile_id = (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer2@wedge.local') LIMIT 1)
      AND sort_order = 1
);

INSERT INTO portfolios (freelancer_profile_id, image_url, description, sort_order, created_at, updated_at)
SELECT
    (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer3@wedge.local') LIMIT 1),
    'https://pub-fedc912f591b44f7b17de6206a872ed7.r2.dev/%EB%8D%94%EB%AF%B8%EC%9D%B4%EB%AF%B8%EC%A7%80/%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A43.png',
    '자연스러운 감성으로 담은 웨딩 스냅 대표 컷입니다.',
    1, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM portfolios
    WHERE freelancer_profile_id = (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer3@wedge.local') LIMIT 1)
      AND sort_order = 1
);

INSERT INTO portfolios (freelancer_profile_id, image_url, description, sort_order, created_at, updated_at)
SELECT
    (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer4@wedge.local') LIMIT 1),
    'https://pub-fedc912f591b44f7b17de6206a872ed7.r2.dev/%EB%8D%94%EB%AF%B8%EC%9D%B4%EB%AF%B8%EC%A7%80/ChatGPT%20Image%202026%EB%85%84%206%EC%9B%94%2019%EC%9D%BC%20%EC%98%A4%ED%9B%84%2004_16_22-01.png',
    '감동적인 축가 무대 현장 사진입니다.',
    1, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM portfolios
    WHERE freelancer_profile_id = (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer4@wedge.local') LIMIT 1)
      AND sort_order = 1
);

INSERT INTO portfolios (freelancer_profile_id, image_url, description, sort_order, created_at, updated_at)
SELECT
    (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer5@wedge.local') LIMIT 1),
    'https://pub-fedc912f591b44f7b17de6206a872ed7.r2.dev/%EB%8D%94%EB%AF%B8%EC%9D%B4%EB%AF%B8%EC%A7%80/ChatGPT%20Image%202026%EB%85%84%206%EC%9B%94%2019%EC%9D%BC%20%EC%98%A4%ED%9B%84%2004_16_22-06.png',
    '신부 헤어 메이크업 완성 컷입니다.',
    1, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM portfolios
    WHERE freelancer_profile_id = (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer5@wedge.local') LIMIT 1)
      AND sort_order = 1
);

INSERT INTO portfolios (freelancer_profile_id, image_url, description, sort_order, created_at, updated_at)
SELECT
    (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer6@wedge.local') LIMIT 1),
    'https://pub-fedc912f591b44f7b17de6206a872ed7.r2.dev/%EB%8D%94%EB%AF%B8%EC%9D%B4%EB%AF%B8%EC%A7%80/%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A45.png',
    '화사한 웨딩 플라워 장식 대표 컷입니다.',
    1, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM portfolios
    WHERE freelancer_profile_id = (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer6@wedge.local') LIMIT 1)
      AND sort_order = 1
);

INSERT INTO portfolios (freelancer_profile_id, image_url, description, sort_order, created_at, updated_at)
SELECT
    (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer7@wedge.local') LIMIT 1),
    'https://pub-fedc912f591b44f7b17de6206a872ed7.r2.dev/%EB%8D%94%EB%AF%B8%EC%9D%B4%EB%AF%B8%EC%A7%80/ChatGPT%20Image%202026%EB%85%84%206%EC%9B%94%2019%EC%9D%BC%20%EC%98%A4%ED%9B%84%2004_16_22-04.png',
    '따뜻한 분위기의 웨딩 사회 진행 현장입니다.',
    1, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM portfolios
    WHERE freelancer_profile_id = (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer7@wedge.local') LIMIT 1)
      AND sort_order = 1
);

-- =============================================
-- 예약
-- =============================================
INSERT INTO reservations (client_id, freelancer_profile_id, reservation_date, request_message, status, cancel_reason, created_at, updated_at)
SELECT
    (SELECT id FROM members WHERE email = 'test-client@wedge.local' LIMIT 1),
    (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'test-freelancer@wedge.local' LIMIT 1) LIMIT 1),
    '2026-06-20 14:00:00',
    '웨딩 촬영 상담과 스케줄 조율을 부탁드립니다.',
    'REQUESTED',
    NULL,
    '2026-06-15 12:00:00',
    '2026-06-15 12:00:00'
WHERE NOT EXISTS (
    SELECT 1 FROM reservations
    WHERE client_id = (SELECT id FROM members WHERE email = 'test-client@wedge.local' LIMIT 1)
      AND freelancer_profile_id = (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'test-freelancer@wedge.local' LIMIT 1) LIMIT 1)
      AND reservation_date = '2026-06-20 14:00:00'
);

INSERT INTO reservations (client_id, freelancer_profile_id, reservation_date, request_message, status, cancel_reason, created_at, updated_at)
SELECT
    (SELECT id FROM members WHERE email = 'test-client@wedge.local' LIMIT 1),
    (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'test-freelancer@wedge.local' LIMIT 1) LIMIT 1),
    '2026-06-22 16:30:00',
    '촬영 전 의상과 장소에 대한 사전 점검을 원합니다.',
    'ACCEPTED',
    NULL,
    '2026-06-15 12:00:00',
    '2026-06-15 12:00:00'
WHERE NOT EXISTS (
    SELECT 1 FROM reservations
    WHERE client_id = (SELECT id FROM members WHERE email = 'test-client@wedge.local' LIMIT 1)
      AND freelancer_profile_id = (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'test-freelancer@wedge.local' LIMIT 1) LIMIT 1)
      AND reservation_date = '2026-06-22 16:30:00'
);

-- =============================================
-- 추가 프리랜서 10명 (회원 + 프로필)
-- =============================================
INSERT INTO members (email, password, name, phone, role, status, provider, provider_id, created_at, updated_at)
SELECT 'freelancer8@wedge.local', '$2a$10$bo9IwOuoBfZPrirjku2kAe6yCeMR6ajU/Nq7uRXeAdMEr8vCj3eye', '윤플래너', '010-7001-1001', 'FREELANCER', 'ACTIVE', 'LOCAL', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM members WHERE email = 'freelancer8@wedge.local');

INSERT INTO members (email, password, name, phone, role, status, provider, provider_id, created_at, updated_at)
SELECT 'freelancer9@wedge.local', '$2a$10$bo9IwOuoBfZPrirjku2kAe6yCeMR6ajU/Nq7uRXeAdMEr8vCj3eye', '강주례', '010-7001-1002', 'FREELANCER', 'ACTIVE', 'LOCAL', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM members WHERE email = 'freelancer9@wedge.local');

INSERT INTO members (email, password, name, phone, role, status, provider, provider_id, created_at, updated_at)
SELECT 'freelancer10@wedge.local', '$2a$10$bo9IwOuoBfZPrirjku2kAe6yCeMR6ajU/Nq7uRXeAdMEr8vCj3eye', '임밴드', '010-7001-1003', 'FREELANCER', 'ACTIVE', 'LOCAL', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM members WHERE email = 'freelancer10@wedge.local');

INSERT INTO members (email, password, name, phone, role, status, provider, provider_id, created_at, updated_at)
SELECT 'freelancer11@wedge.local', '$2a$10$bo9IwOuoBfZPrirjku2kAe6yCeMR6ajU/Nq7uRXeAdMEr8vCj3eye', '조프리랜서', '010-7001-1004', 'FREELANCER', 'ACTIVE', 'LOCAL', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM members WHERE email = 'freelancer11@wedge.local');

INSERT INTO members (email, password, name, phone, role, status, provider, provider_id, created_at, updated_at)
SELECT 'freelancer12@wedge.local', '$2a$10$bo9IwOuoBfZPrirjku2kAe6yCeMR6ajU/Nq7uRXeAdMEr8vCj3eye', '한대전', '010-7001-1005', 'FREELANCER', 'ACTIVE', 'LOCAL', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM members WHERE email = 'freelancer12@wedge.local');

INSERT INTO members (email, password, name, phone, role, status, provider, provider_id, created_at, updated_at)
SELECT 'freelancer13@wedge.local', '$2a$10$bo9IwOuoBfZPrirjku2kAe6yCeMR6ajU/Nq7uRXeAdMEr8vCj3eye', '서영상', '010-7001-1006', 'FREELANCER', 'ACTIVE', 'LOCAL', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM members WHERE email = 'freelancer13@wedge.local');

INSERT INTO members (email, password, name, phone, role, status, provider, provider_id, created_at, updated_at)
SELECT 'freelancer14@wedge.local', '$2a$10$bo9IwOuoBfZPrirjku2kAe6yCeMR6ajU/Nq7uRXeAdMEr8vCj3eye', '문헤어', '010-7001-1007', 'FREELANCER', 'ACTIVE', 'LOCAL', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM members WHERE email = 'freelancer14@wedge.local');

INSERT INTO members (email, password, name, phone, role, status, provider, provider_id, created_at, updated_at)
SELECT 'freelancer15@wedge.local', '$2a$10$bo9IwOuoBfZPrirjku2kAe6yCeMR6ajU/Nq7uRXeAdMEr8vCj3eye', '백플라워', '010-7001-1008', 'FREELANCER', 'ACTIVE', 'LOCAL', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM members WHERE email = 'freelancer15@wedge.local');

INSERT INTO members (email, password, name, phone, role, status, provider, provider_id, created_at, updated_at)
SELECT 'freelancer16@wedge.local', '$2a$10$bo9IwOuoBfZPrirjku2kAe6yCeMR6ajU/Nq7uRXeAdMEr8vCj3eye', '노축가', '010-7001-1009', 'FREELANCER', 'ACTIVE', 'LOCAL', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM members WHERE email = 'freelancer16@wedge.local');

INSERT INTO members (email, password, name, phone, role, status, provider, provider_id, created_at, updated_at)
SELECT 'freelancer17@wedge.local', '$2a$10$bo9IwOuoBfZPrirjku2kAe6yCeMR6ajU/Nq7uRXeAdMEr8vCj3eye', '길사회자', '010-7001-1010', 'FREELANCER', 'ACTIVE', 'LOCAL', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM members WHERE email = 'freelancer17@wedge.local');

INSERT INTO freelancer_profiles (member_id, category_id, title, introduction, region, price, career_years, bookmark_count, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'freelancer8@wedge.local'), 5, '토탈 웨딩 플래닝', '예산부터 컨셉, 당일 진행까지 처음부터 끝까지 함께합니다.', '서울', 1200000, 9, 15, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer8@wedge.local'));

INSERT INTO freelancer_profiles (member_id, category_id, title, introduction, region, price, career_years, bookmark_count, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'freelancer9@wedge.local'), 6, '품격있는 주례사', '진심이 담긴 주례사로 식장의 분위기를 한층 더 따뜻하게 만들어드립니다.', '서울', 200000, 15, 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer9@wedge.local'));

INSERT INTO freelancer_profiles (member_id, category_id, title, introduction, region, price, career_years, bookmark_count, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'freelancer10@wedge.local'), 7, '라이브 웨딩 밴드', '현악 4중주부터 풀밴드까지, 예식 분위기에 맞는 라이브 연주를 제공합니다.', '인천', 900000, 6, 12, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer10@wedge.local'));

INSERT INTO freelancer_profiles (member_id, category_id, title, introduction, region, price, career_years, bookmark_count, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'freelancer11@wedge.local'), 10, '맞춤형 웨딩 토탈 케어', '기타 분류에 속하는 다양한 웨딩 부가 서비스를 제공합니다.', '서울', 600000, 3, 7, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer11@wedge.local'));

INSERT INTO freelancer_profiles (member_id, category_id, title, introduction, region, price, career_years, bookmark_count, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'freelancer12@wedge.local'), 1, '대전 감성 웨딩 포토', '자연광을 활용한 따뜻한 톤의 웨딩 촬영을 전문으로 합니다.', '대전', 450000, 4, 14, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer12@wedge.local'));

INSERT INTO freelancer_profiles (member_id, category_id, title, introduction, region, price, career_years, bookmark_count, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'freelancer13@wedge.local'), 2, '광주 시네마틱 웨딩필름', '드라마틱한 색감과 구성으로 영화같은 웨딩 영상을 제작합니다.', '광주', 700000, 5, 9, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer13@wedge.local'));

INSERT INTO freelancer_profiles (member_id, category_id, title, introduction, region, price, career_years, bookmark_count, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'freelancer14@wedge.local'), 3, '부산 브라이덜 헤어메이크업', '신부 본연의 분위기를 살리는 자연스러운 메이크업을 지향합니다.', '부산', 320000, 7, 10, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer14@wedge.local'));

INSERT INTO freelancer_profiles (member_id, category_id, title, introduction, region, price, career_years, bookmark_count, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'freelancer15@wedge.local'), 4, '제주 플라워 스타일링', '제주의 자연스러운 색감을 살린 웨딩 플라워를 디자인합니다.', '제주', 380000, 5, 6, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer15@wedge.local'));

INSERT INTO freelancer_profiles (member_id, category_id, title, introduction, region, price, career_years, bookmark_count, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'freelancer16@wedge.local'), 8, '감미로운 웨딩 축가', '편안하면서도 감동적인 음색으로 식장 분위기를 채워드립니다.', '서울', 280000, 8, 8, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer16@wedge.local'));

INSERT INTO freelancer_profiles (member_id, category_id, title, introduction, region, price, career_years, bookmark_count, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'freelancer17@wedge.local'), 9, '센스있는 웨딩 사회', '유연한 진행과 센스있는 멘트로 식장 분위기를 이끌어갑니다.', '경기', 450000, 6, 5, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer17@wedge.local'));

-- 추가 프리랜서 10명 포트폴리오
INSERT INTO portfolios (freelancer_profile_id, image_url, description, sort_order, created_at, updated_at)
SELECT (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer8@wedge.local') LIMIT 1),
       'https://pub-fedc912f591b44f7b17de6206a872ed7.r2.dev/%EB%8D%94%EB%AF%B8%EC%9D%B4%EB%AF%B8%EC%A7%80/%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A48.png',
       '토탈 플래닝으로 진행한 웨딩 현장 대표 컷입니다.', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM portfolios WHERE freelancer_profile_id = (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer8@wedge.local') LIMIT 1) AND sort_order = 1);

INSERT INTO portfolios (freelancer_profile_id, image_url, description, sort_order, created_at, updated_at)
SELECT (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer9@wedge.local') LIMIT 1),
       'https://pub-fedc912f591b44f7b17de6206a872ed7.r2.dev/%EB%8D%94%EB%AF%B8%EC%9D%B4%EB%AF%B8%EC%A7%80/ChatGPT%20Image%202026%EB%85%84%206%EC%9B%94%2019%EC%9D%BC%20%EC%98%A4%ED%9B%84%2004_16_22-07.png',
       '따뜻한 주례사로 감동을 드린 현장입니다.', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM portfolios WHERE freelancer_profile_id = (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer9@wedge.local') LIMIT 1) AND sort_order = 1);

INSERT INTO portfolios (freelancer_profile_id, image_url, description, sort_order, created_at, updated_at)
SELECT (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer10@wedge.local') LIMIT 1),
       'https://pub-fedc912f591b44f7b17de6206a872ed7.r2.dev/%EB%8D%94%EB%AF%B8%EC%9D%B4%EB%AF%B8%EC%A7%80/cut_09.png',
       '라이브 밴드 연주 현장 대표 컷입니다.', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM portfolios WHERE freelancer_profile_id = (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer10@wedge.local') LIMIT 1) AND sort_order = 1);

INSERT INTO portfolios (freelancer_profile_id, image_url, description, sort_order, created_at, updated_at)
SELECT (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer11@wedge.local') LIMIT 1),
       'https://pub-fedc912f591b44f7b17de6206a872ed7.r2.dev/%EB%8D%94%EB%AF%B8%EC%9D%B4%EB%AF%B8%EC%A7%80/%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A410.png',
       '토탈 케어 서비스 대표 컷입니다.', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM portfolios WHERE freelancer_profile_id = (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer11@wedge.local') LIMIT 1) AND sort_order = 1);

INSERT INTO portfolios (freelancer_profile_id, image_url, description, sort_order, created_at, updated_at)
SELECT (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer12@wedge.local') LIMIT 1),
       'https://pub-fedc912f591b44f7b17de6206a872ed7.r2.dev/%EB%8D%94%EB%AF%B8%EC%9D%B4%EB%AF%B8%EC%A7%80/cut_03.png',
       '대전 야외 예식 웨딩 스냅 대표 컷입니다.', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM portfolios WHERE freelancer_profile_id = (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer12@wedge.local') LIMIT 1) AND sort_order = 1);

INSERT INTO portfolios (freelancer_profile_id, image_url, description, sort_order, created_at, updated_at)
SELECT (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer13@wedge.local') LIMIT 1),
       'https://pub-fedc912f591b44f7b17de6206a872ed7.r2.dev/%EB%8D%94%EB%AF%B8%EC%9D%B4%EB%AF%B8%EC%A7%80/cut_06.png',
       '시네마틱 웨딩필름 대표 컷입니다.', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM portfolios WHERE freelancer_profile_id = (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer13@wedge.local') LIMIT 1) AND sort_order = 1);

INSERT INTO portfolios (freelancer_profile_id, image_url, description, sort_order, created_at, updated_at)
SELECT (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer14@wedge.local') LIMIT 1),
       'https://pub-fedc912f591b44f7b17de6206a872ed7.r2.dev/%EB%8D%94%EB%AF%B8%EC%9D%B4%EB%AF%B8%EC%A7%80/ChatGPT%20Image%202026%EB%85%84%206%EC%9B%94%2019%EC%9D%BC%20%EC%98%A4%ED%9B%84%2004_16_22-08.png',
       '부산 브라이덜 메이크업 대표 컷입니다.', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM portfolios WHERE freelancer_profile_id = (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer14@wedge.local') LIMIT 1) AND sort_order = 1);

INSERT INTO portfolios (freelancer_profile_id, image_url, description, sort_order, created_at, updated_at)
SELECT (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer15@wedge.local') LIMIT 1),
       'https://pub-fedc912f591b44f7b17de6206a872ed7.r2.dev/%EB%8D%94%EB%AF%B8%EC%9D%B4%EB%AF%B8%EC%A7%80/%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A44.png',
       '제주 플라워 스타일링 대표 컷입니다.', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM portfolios WHERE freelancer_profile_id = (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer15@wedge.local') LIMIT 1) AND sort_order = 1);

INSERT INTO portfolios (freelancer_profile_id, image_url, description, sort_order, created_at, updated_at)
SELECT (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer16@wedge.local') LIMIT 1),
       'https://pub-fedc912f591b44f7b17de6206a872ed7.r2.dev/%EB%8D%94%EB%AF%B8%EC%9D%B4%EB%AF%B8%EC%A7%80/ChatGPT%20Image%202026%EB%85%84%206%EC%9B%94%2019%EC%9D%BC%20%EC%98%A4%ED%9B%84%2004_16_22-05.png',
       '감미로운 축가 무대 현장입니다.', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM portfolios WHERE freelancer_profile_id = (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer16@wedge.local') LIMIT 1) AND sort_order = 1);

INSERT INTO portfolios (freelancer_profile_id, image_url, description, sort_order, created_at, updated_at)
SELECT (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer17@wedge.local') LIMIT 1),
       'https://pub-fedc912f591b44f7b17de6206a872ed7.r2.dev/%EB%8D%94%EB%AF%B8%EC%9D%B4%EB%AF%B8%EC%A7%80/cut_12.png',
       '센스있는 웨딩 사회 진행 현장입니다.', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM portfolios WHERE freelancer_profile_id = (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer17@wedge.local') LIMIT 1) AND sort_order = 1);

-- =============================================
-- 기존 프리랜서 찜 수 업데이트 (fallback 정렬 테스트용)
-- =============================================
UPDATE freelancer_profiles SET bookmark_count = 13
WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer4@wedge.local');

UPDATE freelancer_profiles SET bookmark_count = 11
WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer5@wedge.local');

UPDATE freelancer_profiles SET bookmark_count = 4
WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer7@wedge.local');

-- =============================================
-- 리뷰 검증용 클라이언트 추가
-- =============================================
INSERT INTO members (email, password, name, phone, role, status, provider, provider_id, created_at, updated_at)
SELECT 'test-client2@wedge.local', '$2a$10$bo9IwOuoBfZPrirjku2kAe6yCeMR6ajU/Nq7uRXeAdMEr8vCj3eye', '김신랑', '010-7002-1001', 'CLIENT', 'ACTIVE', 'LOCAL', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM members WHERE email = 'test-client2@wedge.local');

INSERT INTO members (email, password, name, phone, role, status, provider, provider_id, created_at, updated_at)
SELECT 'test-client3@wedge.local', '$2a$10$bo9IwOuoBfZPrirjku2kAe6yCeMR6ajU/Nq7uRXeAdMEr8vCj3eye', '이신부', '010-7002-1002', 'CLIENT', 'ACTIVE', 'LOCAL', NULL, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM members WHERE email = 'test-client3@wedge.local');

-- =============================================
-- 리뷰 검증용 예약 + 리뷰
-- =============================================
INSERT INTO reservations (client_id, freelancer_profile_id, reservation_date, request_message, status, cancel_reason, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'test-client@wedge.local'),
       (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'test-freelancer@wedge.local') LIMIT 1),
       NOW() - INTERVAL 2 DAY, '[SEED-REVIEW-01]', 'COMPLETED', NULL, NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY
WHERE NOT EXISTS (SELECT 1 FROM reservations WHERE request_message = '[SEED-REVIEW-01]');

INSERT INTO reservations (client_id, freelancer_profile_id, reservation_date, request_message, status, cancel_reason, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'test-client@wedge.local'),
       (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'test-freelancer@wedge.local') LIMIT 1),
       NOW() - INTERVAL 6 DAY, '[SEED-REVIEW-02]', 'COMPLETED', NULL, NOW() - INTERVAL 6 DAY, NOW() - INTERVAL 6 DAY
WHERE NOT EXISTS (SELECT 1 FROM reservations WHERE request_message = '[SEED-REVIEW-02]');

INSERT INTO reservations (client_id, freelancer_profile_id, reservation_date, request_message, status, cancel_reason, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'test-client@wedge.local'),
       (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'test-freelancer@wedge.local') LIMIT 1),
       NOW() - INTERVAL 11 DAY, '[SEED-REVIEW-03]', 'COMPLETED', NULL, NOW() - INTERVAL 11 DAY, NOW() - INTERVAL 11 DAY
WHERE NOT EXISTS (SELECT 1 FROM reservations WHERE request_message = '[SEED-REVIEW-03]');

INSERT INTO reservations (client_id, freelancer_profile_id, reservation_date, request_message, status, cancel_reason, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'test-client@wedge.local'),
       (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'test-freelancer@wedge.local') LIMIT 1),
       NOW() - INTERVAL 18 DAY, '[SEED-REVIEW-04]', 'COMPLETED', NULL, NOW() - INTERVAL 18 DAY, NOW() - INTERVAL 18 DAY
WHERE NOT EXISTS (SELECT 1 FROM reservations WHERE request_message = '[SEED-REVIEW-04]');

INSERT INTO reservations (client_id, freelancer_profile_id, reservation_date, request_message, status, cancel_reason, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'test-client@wedge.local'),
       (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer9@wedge.local') LIMIT 1),
       NOW() - INTERVAL 8 DAY, '[SEED-REVIEW-05]', 'COMPLETED', NULL, NOW() - INTERVAL 8 DAY, NOW() - INTERVAL 8 DAY
WHERE NOT EXISTS (SELECT 1 FROM reservations WHERE request_message = '[SEED-REVIEW-05]');

INSERT INTO reservations (client_id, freelancer_profile_id, reservation_date, request_message, status, cancel_reason, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'test-client2@wedge.local'),
       (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer3@wedge.local') LIMIT 1),
       NOW() - INTERVAL 3 DAY, '[SEED-REVIEW-06]', 'COMPLETED', NULL, NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY
WHERE NOT EXISTS (SELECT 1 FROM reservations WHERE request_message = '[SEED-REVIEW-06]');

INSERT INTO reservations (client_id, freelancer_profile_id, reservation_date, request_message, status, cancel_reason, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'test-client2@wedge.local'),
       (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer3@wedge.local') LIMIT 1),
       NOW() - INTERVAL 9 DAY, '[SEED-REVIEW-07]', 'COMPLETED', NULL, NOW() - INTERVAL 9 DAY, NOW() - INTERVAL 9 DAY
WHERE NOT EXISTS (SELECT 1 FROM reservations WHERE request_message = '[SEED-REVIEW-07]');

INSERT INTO reservations (client_id, freelancer_profile_id, reservation_date, request_message, status, cancel_reason, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'test-client2@wedge.local'),
       (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer3@wedge.local') LIMIT 1),
       NOW() - INTERVAL 20 DAY, '[SEED-REVIEW-08]', 'COMPLETED', NULL, NOW() - INTERVAL 20 DAY, NOW() - INTERVAL 20 DAY
WHERE NOT EXISTS (SELECT 1 FROM reservations WHERE request_message = '[SEED-REVIEW-08]');

INSERT INTO reservations (client_id, freelancer_profile_id, reservation_date, request_message, status, cancel_reason, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'test-client3@wedge.local'),
       (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer6@wedge.local') LIMIT 1),
       NOW() - INTERVAL 5 DAY, '[SEED-REVIEW-09]', 'COMPLETED', NULL, NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY
WHERE NOT EXISTS (SELECT 1 FROM reservations WHERE request_message = '[SEED-REVIEW-09]');

INSERT INTO reservations (client_id, freelancer_profile_id, reservation_date, request_message, status, cancel_reason, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'test-client3@wedge.local'),
       (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer6@wedge.local') LIMIT 1),
       NOW() - INTERVAL 14 DAY, '[SEED-REVIEW-10]', 'COMPLETED', NULL, NOW() - INTERVAL 14 DAY, NOW() - INTERVAL 14 DAY
WHERE NOT EXISTS (SELECT 1 FROM reservations WHERE request_message = '[SEED-REVIEW-10]');

INSERT INTO reservations (client_id, freelancer_profile_id, reservation_date, request_message, status, cancel_reason, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'test-client3@wedge.local'),
       (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer2@wedge.local') LIMIT 1),
       NOW() - INTERVAL 40 DAY, '[SEED-REVIEW-11]', 'COMPLETED', NULL, NOW() - INTERVAL 40 DAY, NOW() - INTERVAL 40 DAY
WHERE NOT EXISTS (SELECT 1 FROM reservations WHERE request_message = '[SEED-REVIEW-11]');

INSERT INTO reservations (client_id, freelancer_profile_id, reservation_date, request_message, status, cancel_reason, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'test-client3@wedge.local'),
       (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer2@wedge.local') LIMIT 1),
       NOW() - INTERVAL 55 DAY, '[SEED-REVIEW-12]', 'COMPLETED', NULL, NOW() - INTERVAL 55 DAY, NOW() - INTERVAL 55 DAY
WHERE NOT EXISTS (SELECT 1 FROM reservations WHERE request_message = '[SEED-REVIEW-12]');

INSERT INTO reviews (client_id, freelancer_profile_id, reservation_id, rating, content, created_at, updated_at)
SELECT r.client_id, r.freelancer_profile_id, r.id, 5, '사진도 너무 예쁘고 분위기도 편안하게 잘 이끌어주셔서 정말 만족스러웠어요.', r.reservation_date, r.reservation_date
FROM reservations r WHERE r.request_message = '[SEED-REVIEW-01]'
                      AND NOT EXISTS (SELECT 1 FROM reviews rv WHERE rv.reservation_id = r.id);

INSERT INTO reviews (client_id, freelancer_profile_id, reservation_id, rating, content, created_at, updated_at)
SELECT r.client_id, r.freelancer_profile_id, r.id, 5, '디테일 하나하나 꼼꼼하게 신경써주셔서 감사했습니다. 추천드려요.', r.reservation_date, r.reservation_date
FROM reservations r WHERE r.request_message = '[SEED-REVIEW-02]'
                      AND NOT EXISTS (SELECT 1 FROM reviews rv WHERE rv.reservation_id = r.id);

INSERT INTO reviews (client_id, freelancer_profile_id, reservation_id, rating, content, created_at, updated_at)
SELECT r.client_id, r.freelancer_profile_id, r.id, 4, '전반적으로 만족했지만 일정 조율이 조금 늦어진 점은 아쉬웠어요.', r.reservation_date, r.reservation_date
FROM reservations r WHERE r.request_message = '[SEED-REVIEW-03]'
                      AND NOT EXISTS (SELECT 1 FROM reviews rv WHERE rv.reservation_id = r.id);

INSERT INTO reviews (client_id, freelancer_profile_id, reservation_id, rating, content, created_at, updated_at)
SELECT r.client_id, r.freelancer_profile_id, r.id, 5, '신랑 신부 모두 너무 만족했습니다. 친구들에게도 소개하고 싶어요.', r.reservation_date, r.reservation_date
FROM reservations r WHERE r.request_message = '[SEED-REVIEW-04]'
                      AND NOT EXISTS (SELECT 1 FROM reviews rv WHERE rv.reservation_id = r.id);

INSERT INTO reviews (client_id, freelancer_profile_id, reservation_id, rating, content, created_at, updated_at)
SELECT r.client_id, r.freelancer_profile_id, r.id, 5, '따뜻한 주례사 덕분에 하객분들이 많이 감동받으셨다고 하더라고요.', r.reservation_date, r.reservation_date
FROM reservations r WHERE r.request_message = '[SEED-REVIEW-05]'
                      AND NOT EXISTS (SELECT 1 FROM reviews rv WHERE rv.reservation_id = r.id);

INSERT INTO reviews (client_id, freelancer_profile_id, reservation_id, rating, content, created_at, updated_at)
SELECT r.client_id, r.freelancer_profile_id, r.id, 5, '자연스러운 사진 톤이 정말 마음에 들었어요. 다음에도 또 부탁드리고 싶습니다.', r.reservation_date, r.reservation_date
FROM reservations r WHERE r.request_message = '[SEED-REVIEW-06]'
                      AND NOT EXISTS (SELECT 1 FROM reviews rv WHERE rv.reservation_id = r.id);

INSERT INTO reviews (client_id, freelancer_profile_id, reservation_id, rating, content, created_at, updated_at)
SELECT r.client_id, r.freelancer_profile_id, r.id, 4, '결과물은 만족스러웠지만 보정본 전달이 예상보다 늦었습니다.', r.reservation_date, r.reservation_date
FROM reservations r WHERE r.request_message = '[SEED-REVIEW-07]'
                      AND NOT EXISTS (SELECT 1 FROM reviews rv WHERE rv.reservation_id = r.id);

INSERT INTO reviews (client_id, freelancer_profile_id, reservation_id, rating, content, created_at, updated_at)
SELECT r.client_id, r.freelancer_profile_id, r.id, 5, '촬영 내내 편하게 리드해주셔서 어색하지 않게 잘 찍을 수 있었어요.', r.reservation_date, r.reservation_date
FROM reservations r WHERE r.request_message = '[SEED-REVIEW-08]'
                      AND NOT EXISTS (SELECT 1 FROM reviews rv WHERE rv.reservation_id = r.id);

INSERT INTO reviews (client_id, freelancer_profile_id, reservation_id, rating, content, created_at, updated_at)
SELECT r.client_id, r.freelancer_profile_id, r.id, 5, '꽃 장식이 정말 화사해서 사진이 훨씬 예쁘게 나왔어요. 감사합니다.', r.reservation_date, r.reservation_date
FROM reservations r WHERE r.request_message = '[SEED-REVIEW-09]'
                      AND NOT EXISTS (SELECT 1 FROM reviews rv WHERE rv.reservation_id = r.id);

INSERT INTO reviews (client_id, freelancer_profile_id, reservation_id, rating, content, created_at, updated_at)
SELECT r.client_id, r.freelancer_profile_id, r.id, 4, '색감 조합이 예뻤어요. 다만 설치 시간이 조금 빠듯했습니다.', r.reservation_date, r.reservation_date
FROM reservations r WHERE r.request_message = '[SEED-REVIEW-10]'
                      AND NOT EXISTS (SELECT 1 FROM reviews rv WHERE rv.reservation_id = r.id);

INSERT INTO reviews (client_id, freelancer_profile_id, reservation_id, rating, content, created_at, updated_at)
SELECT r.client_id, r.freelancer_profile_id, r.id, 4, '영상미는 좋았는데 편집본 수정 요청 반영이 다소 더뎠어요.', r.reservation_date, r.reservation_date
FROM reservations r WHERE r.request_message = '[SEED-REVIEW-11]'
                      AND NOT EXISTS (SELECT 1 FROM reviews rv WHERE rv.reservation_id = r.id);

INSERT INTO reviews (client_id, freelancer_profile_id, reservation_id, rating, content, created_at, updated_at)
SELECT r.client_id, r.freelancer_profile_id, r.id, 5, '전체적인 톤 앤 매너가 좋았습니다. 만족스러운 결과물이었어요.', r.reservation_date, r.reservation_date
FROM reservations r WHERE r.request_message = '[SEED-REVIEW-12]'
                      AND NOT EXISTS (SELECT 1 FROM reviews rv WHERE rv.reservation_id = r.id);

-- =============================================
-- 커뮤니티 게시글 더미 데이터
-- =============================================

-- 웨딩 후기 (WEDDING_REVIEW)
INSERT INTO posts (member_id, title, content, type, image_url, is_deleted, created_at, updated_at)
SELECT
    (SELECT id FROM members WHERE email = 'test-client@wedge.local'),
    '드디어 결혼했어요! 웨딩 스냅 후기 남깁니다 🌿',
    '안녕하세요! 지난주에 드디어 결혼식을 올렸습니다. 웨지에서 사진작가 분을 찾아서 진행했는데 너무 만족스러워서 후기 남겨요. 야외 예식이라 날씨 걱정을 많이 했는데 작가님이 자연광을 너무 잘 활용하셔서 사진이 정말 영화같이 나왔어요. 계약 전에 포트폴리오를 꼼꼼히 보고 선택했는데 실제 결과물도 포트폴리오 그대로였습니다. 스몰 웨딩 준비하시는 분들께 꼭 추천드려요!',
    'WEDDING_REVIEW',
    'https://pub-fedc912f591b44f7b17de6206a872ed7.r2.dev/%EB%8D%94%EB%AF%B8%EC%9D%B4%EB%AF%B8%EC%A7%80/cut_01.png',
    false,
    NOW() - INTERVAL 2 DAY,
    NOW() - INTERVAL 2 DAY
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE title = '드디어 결혼했어요! 웨딩 스냅 후기 남깁니다 🌿');

INSERT INTO posts (member_id, title, content, type, image_url, is_deleted, created_at, updated_at)
SELECT
    (SELECT id FROM members WHERE email = 'test-client2@wedge.local'),
    '헤어메이크업 후기 — 웨지로 찾은 아티스트 강추합니다',
    '결혼 준비하면서 헤어메이크업 업체 찾는 게 제일 힘들었는데, 웨지에서 포트폴리오 보고 연락드린 분이 대박이었어요. 리허설부터 당일까지 꼼꼼하게 챙겨주셨고, 제 얼굴형에 맞게 스타일을 조율해주셔서 너무 자연스럽게 나왔습니다. 가격도 웨딩홀 패키지보다 훨씬 합리적이었어요. 다음에 돌잔치 있으면 또 연락드릴 것 같아요 😊',
    'WEDDING_REVIEW',
    'https://pub-fedc912f591b44f7b17de6206a872ed7.r2.dev/%EB%8D%94%EB%AF%B8%EC%9D%B4%EB%AF%B8%EC%A7%80/ChatGPT%20Image%202026%EB%85%84%206%EC%9B%94%2019%EC%9D%BC%20%EC%98%A4%ED%9B%84%2004_16_22-01.png',
    false,
    NOW() - INTERVAL 4 DAY,
    NOW() - INTERVAL 4 DAY
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE title = '헤어메이크업 후기 — 웨지로 찾은 아티스트 강추합니다');

INSERT INTO posts (member_id, title, content, type, image_url, is_deleted, created_at, updated_at)
SELECT
    (SELECT id FROM members WHERE email = 'test-client3@wedge.local'),
    '웨딩 플로리스트 후기 — 부케가 진짜 너무 예뻤어요',
    '꽃을 정말 좋아해서 부케에 많이 신경 썼는데, 웨지에서 찾은 플로리스트 분이 제 취향을 너무 잘 파악해주셨어요. 화이트 계열에 그린을 섞은 내추럴 스타일로 만들어주셨는데 드레스랑 너무 잘 어울렸고 하객분들도 다들 어디서 했냐고 물어봤어요. 설치 시간이 조금 빠듯하긴 했지만 결과물은 완벽했습니다. 제단 장식도 같이 맡겼는데 예식장 분위기가 완전히 달라졌어요!',
    'WEDDING_REVIEW',
    'https://pub-fedc912f591b44f7b17de6206a872ed7.r2.dev/%EB%8D%94%EB%AF%B8%EC%9D%B4%EB%AF%B8%EC%A7%80/%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A41.png',
    false,
    NOW() - INTERVAL 7 DAY,
    NOW() - INTERVAL 7 DAY
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE title = '웨딩 플로리스트 후기 — 부케가 진짜 너무 예뻤어요');

INSERT INTO posts (member_id, title, content, type, image_url, is_deleted, created_at, updated_at)
SELECT
    (SELECT id FROM members WHERE email = 'test-client@wedge.local'),
    '스몰 웨딩 사회자 후기 — 분위기 완전히 살려주셨어요',
    '하객이 50명 남짓한 소규모 결혼식이라 사회자가 필요할까 고민했는데, 웨지에서 프리랜서 사회자 분을 섭외했더니 진짜 탁월한 선택이었어요. 딱딱하지 않고 가족 분위기에 맞게 진행해주셔서 모두가 편안하게 즐길 수 있었어요. 진행 중간에 신랑 신부 깜짝 편지 낭독 코너도 제안해주셔서 하객분들이 감동받으셨어요. 패키지 사회자랑은 차원이 달랐습니다.',
    'WEDDING_REVIEW',
    null,
    false,
    NOW() - INTERVAL 10 DAY,
    NOW() - INTERVAL 10 DAY
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE title = '스몰 웨딩 사회자 후기 — 분위기 완전히 살려주셨어요');

INSERT INTO posts (member_id, title, content, type, image_url, is_deleted, created_at, updated_at)
SELECT
    (SELECT id FROM members WHERE email = 'test-client2@wedge.local'),
    '웨딩 영상 후기 — 시네마틱 영상 진짜 눈물 났어요',
    '결혼식 당일엔 너무 정신없어서 기억이 잘 안 나는데 영상 받고 나서 처음으로 제 결혼식을 제대로 봤어요. 드론 샷부터 클로즈업까지 너무 감성적으로 편집해주셔서 보는 내내 눈물이 났습니다. 편집본 수정 요청도 빠르게 반영해주셨고, 색보정도 예식장 조명을 완전히 살려내셨어요. 친구들한테 이 영상 보여줬더니 다들 어디서 했냐고 물어봤어요.',
    'WEDDING_REVIEW',
    'https://pub-fedc912f591b44f7b17de6206a872ed7.r2.dev/%EB%8D%94%EB%AF%B8%EC%9D%B4%EB%AF%B8%EC%A7%80/cut_07.png',
    false,
    NOW() - INTERVAL 14 DAY,
    NOW() - INTERVAL 14 DAY
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE title = '웨딩 영상 후기 — 시네마틱 영상 진짜 눈물 났어요');

-- 꿀팁 (TIP)
INSERT INTO posts (member_id, title, content, type, image_url, is_deleted, created_at, updated_at)
SELECT
    (SELECT id FROM members WHERE email = 'test-client@wedge.local'),
    '웨딩 준비 타임라인 — 이 순서대로 하면 덜 힘들어요',
    'D-12개월: 예식장, 스드메 계약 / D-9개월: 청첩장 디자인 / D-6개월: 한복, 예물 / D-3개월: 리허설 메이크업, 사진작가 컨셉 미팅 / D-1개월: 최종 점검. 저는 사진작가를 너무 늦게 알아봐서 원하는 분을 못 구할 뻔했어요. 특히 스냅, 영상은 최소 6개월 전에 예약하세요. 인기 있는 분들은 1년치가 이미 마감인 경우도 많아요. 웨지 같은 플랫폼에서 미리 포트폴리오 보면서 후보 리스트 만들어두는 게 진짜 도움됐어요!',
    'TIP', null, false, NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE title = '웨딩 준비 타임라인 — 이 순서대로 하면 덜 힘들어요');

INSERT INTO posts (member_id, title, content, type, image_url, is_deleted, created_at, updated_at)
SELECT
    (SELECT id FROM members WHERE email = 'test-client3@wedge.local'),
    '프리랜서 웨딩 업체 고르는 꿀팁 5가지',
    '1. 포트폴리오는 최근 6개월 이내 작업 위주로 보세요. 오래된 것만 올려둔 경우 실력이 달라졌을 수 있어요. 2. 미팅 전에 질문 리스트를 꼭 만들어 가세요. 가격, 수정 횟수, 납기일은 반드시 확인! 3. 계약서는 꼼꼼히 읽고 위약금 조항 체크. 4. 리허설 메이크업은 필수예요. 당일 스타일이 내 얼굴에 맞는지 꼭 먼저 확인하세요. 5. 후기보다 포트폴리오 스타일이 내 취향인지가 더 중요해요. 리뷰 좋아도 스타일이 안 맞으면 소용없어요.',
    'TIP', null, false, NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE title = '프리랜서 웨딩 업체 고르는 꿀팁 5가지');

INSERT INTO posts (member_id, title, content, type, image_url, is_deleted, created_at, updated_at)
SELECT
    (SELECT id FROM members WHERE email = 'test-client2@wedge.local'),
    '웨딩 예산 아끼는 현실적인 방법들',
    '1. 스드메 패키지보다 개별 계약이 보통 30% 저렴해요. 번거롭더라도 따로따로 알아보세요. 2. 주중 예식은 주말보다 예식장 대관료가 훨씬 쌉니다. 3. 청첩장은 디지털 청첩장만 해도 충분한 분들에게는 종이 청첩장 생략하면 꽤 절약돼요. 4. 부케는 생화 대신 드라이플라워나 실크플라워로 제작하면 가격이 확 줄어요. 5. 웨딩 촬영 시간대를 오전으로 잡으면 작가 선생님 스케줄이 여유로워서 더 꼼꼼하게 찍어주세요.',
    'TIP', null, false, NOW() - INTERVAL 8 DAY, NOW() - INTERVAL 8 DAY
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE title = '웨딩 예산 아끼는 현실적인 방법들');

INSERT INTO posts (member_id, title, content, type, image_url, is_deleted, created_at, updated_at)
SELECT
    (SELECT id FROM members WHERE email = 'test-client@wedge.local'),
    '웨딩 당일 신부가 꼭 챙겨야 할 것들 체크리스트',
    '[ 가방 속 필수품 ] 비상 약 (소화제, 진통제), 여분 스타킹, 바늘실, 안전핀, 립스틱 (메이크업 아티스트에게 미리 제품 받아두기), 물티슈, 휴대폰 보조배터리. [ 미리 준비할 것 ] 하객 자리 배치표 2부 (진행자용, 예비용), 축가 가사 출력본, 양가 부모님 부케 및 코사지, 답례품 배치 확인. 저는 당일에 스타킹이 올이 풀려서 식은땀 흘렸어요. 여분 스타킹은 진짜 필수입니다!',
    'TIP', null, false, NOW() - INTERVAL 11 DAY, NOW() - INTERVAL 11 DAY
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE title = '웨딩 당일 신부가 꼭 챙겨야 할 것들 체크리스트');

INSERT INTO posts (member_id, title, content, type, image_url, is_deleted, created_at, updated_at)
SELECT
    (SELECT id FROM members WHERE email = 'test-client3@wedge.local'),
    '스몰 웨딩 vs 일반 웨딩 — 직접 둘 다 경험한 입장에서',
    '저는 첫 번째 결혼식(...)은 농담이고, 동생이랑 제 결혼식을 다 준비해봤어요. 동생은 200명 대형 웨딩, 저는 60명 스몰 웨딩. 스몰 웨딩 장점: 하객 한 분 한 분과 제대로 이야기 나눌 수 있어요. 식이 훨씬 따뜻하고 친밀해요. 예산도 생각보다 많이 절약됩니다. 단점: 대형 예식장의 화려함은 포기해야 해요. 어른들 설득이 조금 힘들 수 있어요. 결론은 내가 어떤 결혼식을 원하는지가 제일 중요한 것 같아요.',
    'TIP', null, false, NOW() - INTERVAL 15 DAY, NOW() - INTERVAL 15 DAY
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE title = '스몰 웨딩 vs 일반 웨딩 — 직접 둘 다 경험한 입장에서');