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
