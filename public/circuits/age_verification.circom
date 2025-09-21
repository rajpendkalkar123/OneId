pragma circom 2.0.0;

template AgeVerification() {
    // Private inputs
    signal private input age;
    signal private input threshold;

    // Public inputs
    signal output isOverThreshold;

    // Constraints
    signal diff;
    diff <== age - threshold;
    
    // Check if age > threshold
    isOverThreshold <== diff > 0 ? 1 : 0;
}

component main = AgeVerification(); 