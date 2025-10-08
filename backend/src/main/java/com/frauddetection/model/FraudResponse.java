package com.frauddetection.model;

public class FraudResponse {
    private double fraudProbability;
    private boolean isFraud;

    public FraudResponse(double fraudProbability, boolean isFraud) {
        this.fraudProbability = fraudProbability;
        this.isFraud = isFraud;
    }

    public double getFraudProbability() { return fraudProbability; }
    public boolean isFraud() { return isFraud; }
}
