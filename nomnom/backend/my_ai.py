import tensorflow as tf
import pandas as pd
import numpy as np

# Read data
df = pd.read_csv('backend/food.csv')

# Encode
df['day'] = df['day'].map({'weekday': 0, 'weekend': 1})
df['is_holiday'] = df['is_holiday'].astype(int)

# SPlit input, output
X = df[['day', 'is_holiday', 'food_prepared']].values.astype(float)
y = df[['leftover']].values.astype(float)

# Normalize
X_mean, X_std = X.mean(axis=0), X.std(axis=0)
y_mean, y_std = y.mean(), y.std()

X_n = (X - X_mean) / X_std
y_n = (y - y_mean) / y_std


model = tf.keras.models.Sequential([
    tf.keras.layers.Input(shape=(3,)),
    
    # Hidden layer with dropout
    tf.keras.layers.Dense(8, activation='relu'),
    tf.keras.layers.Dropout(0.1),

    tf.keras.layers.Dense(4, activation='relu'),
    tf.keras.layers.Dropout(0.1),

    # Output layer
    tf.keras.layers.Dense(1)
])

# Train neural network
model.compile(
    optimizer='adam',
    loss='mse',
)

# Fit
model.fit(
    X_n,
    y_n,
    epochs=1000,
    verbose=0
)

# Predict
future = np.array([
    [0, 0, 19000],   # monday, not holiday, 19kg
    [1, 0, 24000],   # saturday, not holiday
    [1, 1, 28000],   # sunday, holiday
], dtype=float)

future_n = (future - X_mean) / X_std
pred_n = model.predict(future_n)
pred = pred_n * y_std + y_mean

print(pred)
