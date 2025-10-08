package com.frauddetection.model;

public class Transaction {
    private double step;
    private String type;
    private double amount;
    private double oldbalanceOrg;
    private double newbalanceOrg;
    private double oldbalanceDest;
    private double newbalanceDest;

    public double getStep() { return step; }
    public void setStep(double step) { this.step = step; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public double getOldbalanceOrg() { return oldbalanceOrg; }
    public void setOldbalanceOrg(double oldbalanceOrg) { this.oldbalanceOrg = oldbalanceOrg; }

    public double getNewbalanceOrg() { return newbalanceOrg; }
    public void setNewbalanceOrg(double newbalanceOrg) { this.newbalanceOrg = newbalanceOrg; }

    public double getOldbalanceDest() { return oldbalanceDest; }
    public void setOldbalanceDest(double oldbalanceDest) { this.oldbalanceDest = oldbalanceDest; }

    public double getNewbalanceDest() { return newbalanceDest; }
    public void setNewbalanceDest(double newbalanceDest) { this.newbalanceDest = newbalanceDest; }
}
