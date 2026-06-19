package hu.ibc.ibcpartners.core.service;

import hu.ibc.ibcpartners.core.dto.PageResponse;
import hu.ibc.ibcpartners.core.dto.SettingDto;
import hu.ibc.ibcpartners.core.entity.Setting;
import hu.ibc.ibcpartners.core.entity.SettingKey;
import hu.ibc.ibcpartners.core.mapper.SettingMapper;
import hu.ibc.ibcpartners.core.repository.SettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class SettingService {

    private final SettingRepository settingRepository;
    private final SettingMapper settingMapper;

    public SettingDto getByKey(SettingKey key) {
        return settingMapper.map(findByKey(key));
    }

    private Setting findByKey(SettingKey key) {
        return settingRepository.findByKey(key)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Beállítás nem található ezzel a kulccsal: " + key));
    }

    public PageResponse<SettingDto> search(Pageable pageable) {
        Page<Setting> page = settingRepository.findAll(pageable);
        return PageResponse.of(page, settingMapper::map);
    }

    public void create(SettingDto dto) {
        settingRepository.save(settingMapper.map(dto));
    }

    public void update(SettingDto dto) {
        Setting setting = findByKey(dto.key());
        settingMapper.map(dto, setting);
        settingRepository.save(setting);
    }
}
