package hu.ibc.ibcpartners.core.service;

import hu.ibc.ibcpartners.core.dto.CityDto;
import hu.ibc.ibcpartners.core.dto.PageResponse;
import hu.ibc.ibcpartners.core.entity.City;
import hu.ibc.ibcpartners.core.mapper.CityMapper;
import hu.ibc.ibcpartners.core.repository.CityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.*;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CityService {

    private final CityRepository cityRepository;
    private final CityMapper cityMapper;

    public CityDto getById(Long id) {
        return cityMapper.map(findById(id));
    }

    private City findById(Long id) {
        return cityRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Település nem található ezzel az ID-val: " + id));
    }

    public PageResponse<CityDto> search(Pageable pageable) {
        Page<City> page = cityRepository.findAll(pageable);
        return PageResponse.of(page, cityMapper::map);
    }

    public List<CityDto> getAll() {
        List<City> cities = cityRepository.findAll(Sort.by(Sort.Direction.ASC, "city"));
        return cities.stream().map(cityMapper::map).toList();
    }

    public void create(CityDto dto) {
        cityRepository.save(cityMapper.map(dto));
    }

    public void update(CityDto dto) {
        City city = findById(dto.id());
        cityMapper.map(dto, city);
        cityRepository.save(city);
    }

    public static void main(String... args) throws IOException {
        Path output = Paths.get("output.sql");
        Set<String> cities = new HashSet<>();
        try (InputStream is = CityService.class.getResourceAsStream("/data.txt");
             BufferedReader reader = new BufferedReader(new InputStreamReader(is, Charset.forName("windows-1250")));
             BufferedWriter writer = Files.newBufferedWriter(output, StandardCharsets.UTF_8)) {

            String line;
            while ((line = reader.readLine()) != null) {
                String[] split = line.split(";");
                if (cities.contains(split[0])) {
                    continue;
                }

                cities.add(split[0]);
                writer.write("INSERT INTO cities (city, created_at, created_by, modified_at, modified_by)" +
                        " VALUES ('" + split[0].replace("\"", "") + "', now(), 1, now(), 1);\n");
            }
        }
    }
}
