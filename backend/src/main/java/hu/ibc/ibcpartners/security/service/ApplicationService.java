package hu.ibc.ibcpartners.security.service;

import hu.ibc.ibcpartners.common.dto.PageResponse;
import hu.ibc.ibcpartners.security.dto.ApplicationComment;
import hu.ibc.ibcpartners.security.dto.ApplicationDto;
import hu.ibc.ibcpartners.security.dto.ApplicationRequest;
import hu.ibc.ibcpartners.security.entity.Application;
import hu.ibc.ibcpartners.security.entity.ApplicationState;
import hu.ibc.ibcpartners.security.entity.User;
import hu.ibc.ibcpartners.security.mapper.ApplicationMapper;
import hu.ibc.ibcpartners.security.repository.ApplicationRepository;
import hu.ibc.ibcpartners.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ApplicationMapper applicationMapper;
    private final UserRepository userRepository;

    public void create(ApplicationRequest applicationDto) {
        Application application = applicationMapper.map(applicationDto);
        application.setState(ApplicationState.CREATED);

        applicationRepository.save(application);
    }

    public PageResponse<ApplicationDto> search(Pageable pageable) {
        return PageResponse.of(applicationRepository.findAll(pageable), applicationMapper::map);
    }

    public ApplicationDto get(Long id) {
        Application application = findById(id);
        return applicationMapper.map(application, getSalesName(application.getSalesId()));
    }

    private Application findById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Érdeklődő nem található!"));
    }

    @Transactional
    public ApplicationDto changeState(Long id, ApplicationState state, Long salesId) {
        Application application = findById(id);

        application.setState(state);
        if (salesId != null) {
            application.setSalesId(salesId);
        }

        applicationRepository.saveAndFlush(application);
        return applicationMapper.map(application, getSalesName(application.getSalesId()));
    }

    private String getSalesName(Long salesId) {
        return Optional.ofNullable(salesId).flatMap(userRepository::findById).map(User::getFullName).orElse(null);
    }

    @Transactional
    public ApplicationDto comment(Long id, ApplicationComment comment) {
        Application application = findById(id);

        if (StringUtils.isNotBlank(comment.comment()) && !comment.comment().equals(application.getComment())) {
            application.setComment(comment.comment());
            applicationRepository.saveAndFlush(application);
        }

        return applicationMapper.map(application);
    }
}