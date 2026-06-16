INSERT INTO categories (name)
SELECT 'Photography'
WHERE NOT EXISTS (
    SELECT 1
    FROM categories
    WHERE name = 'Photography'
);

INSERT INTO members (
    email,
    password,
    name,
    phone,
    role,
    status,
    provider,
    provider_id,
    created_at,
    updated_at
)
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
WHERE NOT EXISTS (
    SELECT 1
    FROM members
    WHERE email = 'test-client@wedge.local'
);

INSERT INTO members (
    email,
    password,
    name,
    phone,
    role,
    status,
    provider,
    provider_id,
    created_at,
    updated_at
)
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
WHERE NOT EXISTS (
    SELECT 1
    FROM members
    WHERE email = 'test-freelancer@wedge.local'
);

INSERT INTO freelancer_profiles (
    member_id,
    category_id,
    title,
    introduction,
    region,
    price,
    career_years,
    bookmark_count,
    created_at,
    updated_at
)
SELECT
    (SELECT id FROM members WHERE email = 'test-freelancer@wedge.local' LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Photography' LIMIT 1),
    '서울 웨딩 스토리텔러',
    '자연스러운 감성과 세련된 구도로 웨딩 순간을 담는 로컬 테스트 프로필입니다.',
    'Seoul',
    850000,
    6,
    12,
    '2026-06-15 12:00:00',
    '2026-06-15 12:00:00'
WHERE NOT EXISTS (
    SELECT 1
    FROM freelancer_profiles
    WHERE member_id = (SELECT id FROM members WHERE email = 'test-freelancer@wedge.local' LIMIT 1)
);

INSERT INTO portfolios (
    freelancer_profile_id,
    image_url,
    description,
    sort_order,
    created_at,
    updated_at
)
SELECT
    (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'test-freelancer@wedge.local' LIMIT 1) LIMIT 1),
    'https://picsum.photos/seed/wedge-portfolio-1/800/600',
    '야외 예식의 부드러운 톤을 담은 포트폴리오 샘플입니다.',
    1,
    '2026-06-15 12:00:00',
    '2026-06-15 12:00:00'
WHERE NOT EXISTS (
    SELECT 1
    FROM portfolios
    WHERE freelancer_profile_id = (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'test-freelancer@wedge.local' LIMIT 1) LIMIT 1)
      AND sort_order = 1
);

INSERT INTO portfolios (
    freelancer_profile_id,
    image_url,
    description,
    sort_order,
    created_at,
    updated_at
)
SELECT
    (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'test-freelancer@wedge.local' LIMIT 1) LIMIT 1),
    'https://picsum.photos/seed/wedge-portfolio-2/800/600',
    '실내 예식과 리허설 컷을 가정한 두 번째 포트폴리오 샘플입니다.',
    2,
    '2026-06-15 12:00:00',
    '2026-06-15 12:00:00'
WHERE NOT EXISTS (
    SELECT 1
    FROM portfolios
    WHERE freelancer_profile_id = (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'test-freelancer@wedge.local' LIMIT 1) LIMIT 1)
      AND sort_order = 2
);

INSERT INTO reservations (
    client_id,
    freelancer_profile_id,
    reservation_date,
    request_message,
    status,
    cancel_reason,
    created_at,
    updated_at
)
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
    SELECT 1
    FROM reservations
    WHERE client_id = (SELECT id FROM members WHERE email = 'test-client@wedge.local' LIMIT 1)
      AND freelancer_profile_id = (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'test-freelancer@wedge.local' LIMIT 1) LIMIT 1)
      AND reservation_date = '2026-06-20 14:00:00'
);

INSERT INTO reservations (
    client_id,
    freelancer_profile_id,
    reservation_date,
    request_message,
    status,
    cancel_reason,
    created_at,
    updated_at
)
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
    SELECT 1
    FROM reservations
    WHERE client_id = (SELECT id FROM members WHERE email = 'test-client@wedge.local' LIMIT 1)
      AND freelancer_profile_id = (SELECT id FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'test-freelancer@wedge.local' LIMIT 1) LIMIT 1)
      AND reservation_date = '2026-06-22 16:30:00'
);
INSERT INTO categories (name) SELECT '웨딩 영상' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = '웨딩 영상');
INSERT INTO categories (name) SELECT '웨딩 스냅사진' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = '웨딩 스냅사진');
INSERT INTO categories (name) SELECT '축가' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = '축가');
INSERT INTO categories (name) SELECT '헤어&메이크업' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = '헤어&메이크업');
INSERT INTO categories (name) SELECT '웨딩 플로리스트' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = '웨딩 플로리스트');
INSERT INTO categories (name) SELECT '사회자' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = '사회자');
INSERT INTO categories (name) SELECT '드레스·정장' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = '드레스·정장');
INSERT INTO categories (name) SELECT '하객알바' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = '하객알바');
INSERT INTO categories (name) SELECT '기타' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = '기타');

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

INSERT INTO members (email, password, name, phone, role, status, provider, provider_id, created_at, updated_at)
SELECT 'freelancer8@wedge.local', '$2a$10$bo9IwOuoBfZPrirjku2kAe6yCeMR6ajU/Nq7uRXeAdMEr8vCj3eye', '오드레스', '010-7890-1234', 'FREELANCER', 'ACTIVE', 'LOCAL', NULL, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM members WHERE email = 'freelancer8@wedge.local');

INSERT INTO freelancer_profiles (member_id, category_id, title, introduction, region, price, career_years, bookmark_count, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'freelancer2@wedge.local'), (SELECT id FROM categories WHERE name = '웨딩 영상'), '시네마틱 웨딩 영상', '영화같은 웨딩 영상을 제작합니다.', '부산', 800000, 7, 0, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer2@wedge.local'));

INSERT INTO freelancer_profiles (member_id, category_id, title, introduction, region, price, career_years, bookmark_count, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'freelancer3@wedge.local'), (SELECT id FROM categories WHERE name = '웨딩 스냅사진'), '감성 웨딩 스냅사진', '자연스러운 순간을 담는 감성 스냅사진 전문가입니다.', '서울', 500000, 5, 0, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer3@wedge.local'));

INSERT INTO freelancer_profiles (member_id, category_id, title, introduction, region, price, career_years, bookmark_count, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'freelancer4@wedge.local'), (SELECT id FROM categories WHERE name = '축가'), '감동적인 웨딩 축가', '풍부한 성량으로 하객들의 마음을 울리는 축가 전문가입니다.', '서울', 300000, 4, 0, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer4@wedge.local'));

INSERT INTO freelancer_profiles (member_id, category_id, title, introduction, region, price, career_years, bookmark_count, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'freelancer5@wedge.local'), (SELECT id FROM categories WHERE name = '헤어&메이크업'), '헤어&메이크업 아티스트', '청담동 출신 헤어메이크업 전문가입니다.', '서울', 350000, 6, 0, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer5@wedge.local'));

INSERT INTO freelancer_profiles (member_id, category_id, title, introduction, region, price, career_years, bookmark_count, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'freelancer6@wedge.local'), (SELECT id FROM categories WHERE name = '웨딩 플로리스트'), '웨딩 플로리스트', '아름다운 꽃장식으로 웨딩 공간을 화사하게 꾸며드립니다.', '경기', 400000, 8, 0, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer6@wedge.local'));

INSERT INTO freelancer_profiles (member_id, category_id, title, introduction, region, price, career_years, bookmark_count, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'freelancer7@wedge.local'), (SELECT id FROM categories WHERE name = '사회자'), '전문 웨딩 사회자', '유머와 감동을 살리는 10년 경력의 웨딩 사회자입니다.', '서울', 500000, 10, 0, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer7@wedge.local'));

INSERT INTO freelancer_profiles (member_id, category_id, title, introduction, region, price, career_years, bookmark_count, created_at, updated_at)
SELECT (SELECT id FROM members WHERE email = 'freelancer8@wedge.local'), (SELECT id FROM categories WHERE name = '드레스·정장'), '맞춤 웨딩 드레스', '신부의 개성을 살린 맞춤 드레스를 제작합니다.', '서울', 1500000, 12, 0, NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM freelancer_profiles WHERE member_id = (SELECT id FROM members WHERE email = 'freelancer8@wedge.local'));
