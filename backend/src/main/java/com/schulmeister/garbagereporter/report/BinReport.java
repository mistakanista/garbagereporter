package com.schulmeister.garbagereporter.report;

import com.schulmeister.garbagereporter.trashbin.Trashbin;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BinReport {
    private Trashbin trashbin;
    private Report report;
}
