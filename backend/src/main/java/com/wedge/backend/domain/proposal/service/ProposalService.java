package com.wedge.backend.domain.proposal.service;

import com.wedge.backend.domain.freelancer.entity.FreelancerProfile;
import com.wedge.backend.domain.freelancer.repository.FreelancerProfileRepository;
import com.wedge.backend.domain.member.entity.Member;
import com.wedge.backend.domain.proposal.dto.ProposalRequest;
import com.wedge.backend.domain.proposal.dto.ProposalResponse;
import com.wedge.backend.domain.proposal.entity.Proposal;
import com.wedge.backend.domain.proposal.entity.ProposalStatus;
import com.wedge.backend.domain.proposal.repository.ProposalRepository;
import com.wedge.backend.domain.recruit.entity.RecruitPost;
import com.wedge.backend.domain.recruit.entity.RecruitStatus;
import com.wedge.backend.domain.recruit.repository.RecruitPostRepository;
import com.wedge.backend.domain.reservations.entity.Reservation;
import com.wedge.backend.domain.reservations.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProposalService {

    private final ProposalRepository proposalRepository;
    private final RecruitPostRepository recruitPostRepository;
    private final FreelancerProfileRepository freelancerProfileRepository;
    private final ReservationRepository reservationRepository;

    @Transactional
    public ProposalResponse createProposal(Long recruitPostId, Member member, ProposalRequest request) {
        RecruitPost recruitPost = recruitPostRepository.findById(recruitPostId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 구인글입니다."));

        if (recruitPost.getStatus() == RecruitStatus.CLOSED) {
            throw new IllegalStateException("마감된 구인글에는 제안할 수 없습니다.");
        }

        if (recruitPost.getMember().getId().equals(member.getId())) {
            throw new IllegalArgumentException("본인의 구인글에는 제안할 수 없습니다.");
        }

        FreelancerProfile freelancerProfile = freelancerProfileRepository.findByMemberId(member.getId())
                .orElseThrow(() -> new IllegalArgumentException("프리랜서 프로필이 필요합니다."));

        if (proposalRepository.existsByRecruitPostAndFreelancerProfile(recruitPost, freelancerProfile)) {
            throw new IllegalArgumentException("이미 제안한 구인글입니다.");
        }

        if (proposalRepository.countByFreelancerProfileAndStatus(freelancerProfile, ProposalStatus.SUBMITTED) >= 5) {
            throw new IllegalArgumentException("동시 진행 가능한 제안은 최대 5건입니다.");
        }

        Proposal proposal = Proposal.create(recruitPost, freelancerProfile, request.getContent(), request.getPrice(), request.getRegion());
        return new ProposalResponse(proposalRepository.save(proposal));
    }

    public List<ProposalResponse> getProposalsByRecruitPost(Long recruitPostId, Member member) {
        RecruitPost recruitPost = recruitPostRepository.findById(recruitPostId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 구인글입니다."));

        if (!recruitPost.getMember().getId().equals(member.getId())) {
            throw new IllegalStateException("구인글 작성자만 제안서 목록을 조회할 수 있습니다.");
        }

        return proposalRepository.findByRecruitPost(recruitPost).stream()
                .map(ProposalResponse::new)
                .toList();
    }

    public List<ProposalResponse> getMyProposals(Member member) {
        FreelancerProfile freelancerProfile = freelancerProfileRepository.findByMemberId(member.getId())
                .orElseThrow(() -> new IllegalArgumentException("프리랜서 프로필이 필요합니다."));

        return proposalRepository.findByFreelancerProfile(freelancerProfile).stream()
                .map(ProposalResponse::new)
                .toList();
    }

    @Transactional
    public ProposalResponse acceptProposal(Long proposalId, Member member) {
        Proposal proposal = findProposal(proposalId);
        RecruitPost recruitPost = proposal.getRecruitPost();

        validateRecruitPostOwner(recruitPost, member);
        validateProposalStatus(proposal);

        proposal.accept();
        recruitPost.changeStatus(RecruitStatus.CLOSED);

        Reservation reservation = Reservation.create(
                recruitPost.getMember(),
                proposal.getFreelancerProfile(),
                LocalDateTime.from(recruitPost.getWeddingDate().atStartOfDay()),
                proposal.getContent()
        );
        reservationRepository.save(reservation);

        return new ProposalResponse(proposal);
    }

    @Transactional
    public ProposalResponse rejectProposal(Long proposalId, Member member) {
        Proposal proposal = findProposal(proposalId);
        validateRecruitPostOwner(proposal.getRecruitPost(), member);
        validateProposalStatus(proposal);

        proposal.reject();
        return new ProposalResponse(proposal);
    }

    private Proposal findProposal(Long proposalId) {
        return proposalRepository.findById(proposalId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 제안서입니다."));
    }

    private void validateRecruitPostOwner(RecruitPost recruitPost, Member member) {
        if (!recruitPost.getMember().getId().equals(member.getId())) {
            throw new IllegalStateException("구인글 작성자만 제안서를 처리할 수 있습니다.");
        }
    }

    private void validateProposalStatus(Proposal proposal) {
        if (proposal.getStatus() != ProposalStatus.SUBMITTED) {
            throw new IllegalStateException("이미 처리된 제안서입니다.");
        }
    }
}
