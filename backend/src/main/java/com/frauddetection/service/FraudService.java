package com.frauddetection.service;

import ai.onnxruntime.*;
import com.frauddetection.model.Transaction;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.List;

@Service
public class FraudService {

    private final OrtEnvironment env;
    private final OrtSession session;

    public FraudService() throws OrtException {
        env = OrtEnvironment.getEnvironment();
        session = env.createSession("ml_model/fraud_model.onnx", new OrtSession.SessionOptions());
        System.out.println("✅ ONNX model loaded successfully!");
        System.out.println("Model outputs: " + session.getOutputNames());
    }

    public double predictFraud(Transaction tx) throws OrtException {
        float[] input = new float[]{
                (float) tx.getStep(),
                encodeType(tx.getType()),
                (float) tx.getAmount(),
                (float) tx.getOldbalanceOrg(),
                (float) tx.getNewbalanceOrg(),
                (float) tx.getOldbalanceDest(),
                (float) tx.getNewbalanceDest()
        };

        // Wrap input into 2D array (batch size = 1)
        float[][] inputData = new float[1][input.length];
        inputData[0] = input;

        String inputName = session.getInputNames().iterator().next();

        try (OnnxTensor inputTensor = OnnxTensor.createTensor(env, inputData)) {
            Map<String, OnnxTensor> inputs = Map.of(inputName, inputTensor);

            try (OrtSession.Result result = session.run(inputs)) {
                List<String> outputNames = session.getOutputNames().stream().toList();

                // Case 1: Model outputs probabilities as second output
                if (result.size() > 1) {
                    Object probOutput = result.get(1).getValue();
                    if (probOutput instanceof float[][] probs) {
                        return probs[0][1]; // probability of fraud
                    }
                }

                // Case 2: Only one output (label)
                Object value = result.get(0).getValue();

                if (value instanceof float[][] floats) return floats[0][0];
                if (value instanceof float[] floats) return floats[0];
                if (value instanceof double[][] doubles) return doubles[0][0];
                if (value instanceof double[] doubles) return doubles[0];
                if (value instanceof long[][] longs) return longs[0][0];
                if (value instanceof long[] longs) return longs[0];

                throw new IllegalStateException("Unsupported output type: " + value.getClass());
            }
        }
    }

    private float encodeType(String type) {
        return switch (type.toUpperCase()) {
            case "TRANSFER" -> 1f;
            case "CASH_OUT" -> 2f;
            case "PAYMENT" -> 3f;
            case "DEBIT" -> 4f;
            default -> 0f;
        };
    }
}