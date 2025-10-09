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
        System.out.println("Model inputs: " + session.getInputNames());
        System.out.println("Model outputs: " + session.getOutputNames());
    }

    public double predictFraud(Transaction tx) throws OrtException {

        // ✅ Compute engineered features (same as Python)
        float Eorig = (float) (tx.getNewbalanceOrg() + tx.getAmount() - tx.getOldbalanceOrg());
        float Edest = (float) (tx.getOldbalanceDest() + tx.getAmount() - tx.getNewbalanceDest());

        // ✅ Input feature vector (total = 9)
        float[] input = new float[]{
                (float) tx.getStep(),
                encodeType(tx.getType()),
                (float) tx.getAmount(),
                (float) tx.getOldbalanceOrg(),
                (float) tx.getNewbalanceOrg(),
                (float) tx.getOldbalanceDest(),
                (float) tx.getNewbalanceDest(),
                Eorig,
                Edest
        };

        // ✅ Wrap into 2D tensor [1 x 9]
        float[][] inputData = new float[1][input.length];
        inputData[0] = input;

        String inputName = session.getInputNames().iterator().next();

        try (OnnxTensor inputTensor = OnnxTensor.createTensor(env, inputData)) {
            Map<String, OnnxTensor> inputs = Map.of(inputName, inputTensor);

            try (OrtSession.Result result = session.run(inputs)) {
                Object value = result.get(0).getValue();

                // Handle different possible output types
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

    // ✅ FIXED: Match Python's LabelEncoder alphabetical ordering
    private float encodeType(String type) {
        return switch (type.toUpperCase()) {
            case "CASH_OUT" -> 0f;   // Alphabetically first
            case "DEBIT" -> 1f;      // Second
            case "PAYMENT" -> 2f;    // Third
            case "TRANSFER" -> 3f;   // Fourth
            case "CASH_IN" -> 4f;    // Fifth (if exists in your data)
            default -> throw new IllegalArgumentException("Unknown transaction type: " + type);
        };
    }
}