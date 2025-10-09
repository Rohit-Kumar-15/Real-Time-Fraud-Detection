package com.frauddetection.controller;

import com.frauddetection.model.Transaction;
import com.frauddetection.model.FraudResponse;
import com.frauddetection.service.FraudService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class FraudController {

    private final FraudService fraudService;

    public FraudController(FraudService fraudService) {
        this.fraudService = fraudService;
    }

    @PostMapping("/predict")
    public FraudResponse predict(@RequestBody Transaction tx) {
        try {
            double probability = fraudService.predictFraud(tx);
            boolean isFraud = probability >= 0.3;
            System.out.println("Predicted probability of fraud: " + probability);
            return new FraudResponse(probability, isFraud);
        } catch (Exception e) {
            e.printStackTrace();
            return new FraudResponse(0.0, false);
        }
    }
}
