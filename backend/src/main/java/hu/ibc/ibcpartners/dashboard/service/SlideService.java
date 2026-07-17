package hu.ibc.ibcpartners.dashboard.service;

import hu.ibc.ibcpartners.core.dto.PageResponse;
import hu.ibc.ibcpartners.dashboard.dto.SlideDto;
import hu.ibc.ibcpartners.dashboard.entity.Slide;
import hu.ibc.ibcpartners.dashboard.mapper.SlideMapper;
import hu.ibc.ibcpartners.dashboard.repository.SlideRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SlideService {

    private final SlideRepository slideRepository;
    private final SlideMapper slideMapper;

    public SlideDto getById(Long id) {
        return slideMapper.map(findById(id));
    }

    private Slide findById(Long id) {
        return slideRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Dia nem található ezzel az ID-val: " + id));
    }

    public PageResponse<SlideDto> search(Boolean active, Pageable pageable) {
        Page<Slide> page = slideRepository.search(active, pageable);
        return PageResponse.of(page, slideMapper::map);
    }

    public List<SlideDto> getAllVisible() {
        return slideRepository.getAllVisible().stream().map(slideMapper::map).toList();
    }

    public void create(SlideDto dto) {
        slideRepository.save(slideMapper.map(dto));
    }

    @Transactional
    public void update(SlideDto dto) {
        Slide slide = findById(dto.id());
        slideMapper.map(dto, slide);
        slideRepository.save(slide);
    }

    public void delete(Long id) {
        slideRepository.deleteById(id);
    }
}
