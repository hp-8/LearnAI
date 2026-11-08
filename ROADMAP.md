# AI Roadmap: Learn → Solve → Build

Loop per topic: **Learn** (concepts) → **Solve** (5-10 problems, from scratch, NumPy before frameworks) → **Build** (one shippable project) → tick box → next.
Folder per topic: `NN-topic/{notes.md, problems/, project/}`.

---

## Phase 0 — Foundations
- [ ] **00 Python + NumPy/Pandas/Matplotlib**
  Solve: vectorize loops, broadcasting puzzles, groupby/merge drills. Build: EDA report on a Kaggle dataset.
- [ ] **01 Linear Algebra**
  Learn: vectors, matmul, rank, eigen, SVD. Solve: implement matmul, PCA via SVD. Build: image compression with SVD.
- [ ] **02 Calculus + Optimization**
  Learn: gradients, chain rule, convexity, GD/SGD/Adam. Solve: hand-derive + code gradients, numeric grad check. Build: optimizer visualizer on loss surfaces.
- [ ] **03 Probability + Statistics**
  Learn: distributions, Bayes, MLE/MAP, hypothesis tests. Solve: Monte Carlo estimates, Bayes updates, A/B test. Build: Naive Bayes spam filter from scratch.

## Phase 1 — Classical AI (Symbolic)
- [ ] **04 Search + Planning**
  Learn: BFS/DFS, A*, minimax, alpha-beta, CSP. Solve: 8-puzzle A*, sudoku CSP. Build: tic-tac-toe/connect-4 unbeatable bot.
- [ ] **05 Knowledge Representation + Logic**
  Learn: propositional/FOL, inference, forward/backward chaining. Solve: resolution prover, unification. Build: mini Prolog-style engine.
- [ ] **06 Expert Systems**
  Learn: rule bases, inference engine, certainty factors, MYCIN-style. Solve: write rule sets, conflict resolution. Build: diagnosis expert system (e.g., PC troubleshooting) w/ explanation of "why".
- [ ] **07 Fuzzy Logic**
  Learn: membership functions, fuzzy sets/ops, Mamdani vs Sugeno, defuzzification. Solve: implement fuzzy ops + centroid. Build: fuzzy controller (fan speed / car braking) with live plot.
- [ ] **08 Evolutionary + Swarm**
  Learn: GA, PSO, simulated annealing. Solve: TSP via GA, function opt via PSO. Build: evolving agents in a 2D sim.

## Phase 2 — Machine Learning
- [ ] **09 Supervised: Regression** — linear/poly/ridge/lasso from scratch. Build: house price predictor + API.
- [ ] **10 Supervised: Classification** — logistic, kNN, SVM, decision trees. Build: churn classifier.
- [ ] **11 Ensembles** — bagging, RF, boosting, XGBoost/LightGBM. Build: Kaggle tabular comp submission.
- [ ] **12 Unsupervised** — k-means, DBSCAN, GMM/EM, PCA, t-SNE/UMAP. Build: customer segmentation dashboard.
- [ ] **13 ML Engineering** — CV, metrics, bias/variance, leakage, feature eng, pipelines. Build: end-to-end sklearn pipeline + MLflow tracking.
- [ ] **14 Probabilistic Models** — Bayesian nets, HMMs, MCMC. Build: HMM POS tagger.

## Phase 3 — Deep Learning
- [ ] **15 Neural Nets from Scratch** — perceptron, MLP, backprop, autograd. Build: micrograd-style autograd engine + MNIST.
- [ ] **16 PyTorch + Training Craft** — init, BatchNorm, dropout, LR schedules, debugging. Build: training-loop template w/ logging.
- [ ] **17 Sequence Models** — RNN, LSTM, GRU, seq2seq. Build: char-level text generator.
- [ ] **18 Attention + Transformers** — self-attention, positional enc, encoder/decoder. Build: GPT from scratch on small corpus.
- [ ] **19 Generative Models** — autoencoders, VAEs, GANs, diffusion. Build: DDPM generating small images.

## Phase 4 — Computer Vision
- [ ] **20 Classical CV** — convolution, filters, edges, features (SIFT/ORB), homography. Build: panorama stitcher (OpenCV).
- [ ] **21 CNNs** — LeNet→ResNet, transfer learning, augmentation. Build: custom image classifier deployed as web app.
- [ ] **22 Detection + Segmentation** — YOLO, U-Net, Mask R-CNN, SAM. Build: real-time webcam object detector.
- [ ] **23 Modern Vision** — ViT, CLIP, 3D (NeRF/Gaussian splatting basics). Build: CLIP image search over your photos.

## Phase 5 — NLP
- [ ] **24 Classical NLP** — tokenization, n-grams, TF-IDF, word2vec/GloVe. Build: search engine w/ TF-IDF + BM25.
- [ ] **25 Pretrained LMs** — BERT, fine-tuning, NER, classification (HF). Build: fine-tuned sentiment/NER model.
- [ ] **26 LLMs Internals** — tokenizers (BPE), scaling laws, pretraining, SFT, RLHF/DPO, LoRA, quantization. Build: LoRA fine-tune a small open model.

## Phase 6 — Reinforcement Learning
- [ ] **27 RL Basics** — MDPs, DP, Monte Carlo, TD, Q-learning, SARSA. Build: gridworld + FrozenLake solver.
- [ ] **28 Deep RL** — DQN, policy gradients, PPO, actor-critic. Build: agent beating CartPole/LunarLander/Atari game.

## Phase 7 — Robotics
- [ ] **29 Robotics Fundamentals** — kinematics (FK/IK), dynamics, PID control, sensors. Build: simulated 2-link arm reaching targets.
- [ ] **30 Perception + Navigation** — SLAM, Kalman/particle filters, path planning (RRT, A*). Build: robot navigating a maze in ROS2/Gazebo or PyBullet.
- [ ] **31 Robot Learning** — imitation learning, sim2real, VLA models. Build: RL policy for robotic grasping in sim (MuJoCo).

## Phase 8 — Generative AI (Applied)
- [ ] **32 Prompting + LLM APIs** — prompting patterns, structured output, eval. Build: CLI assistant with tool output parsing.
- [ ] **33 Embeddings + RAG** — chunking, vector DBs, reranking, hybrid search, RAG eval. Build: chat-with-your-docs app.
- [ ] **34 Multimodal GenAI** — text-to-image, speech (Whisper/TTS), vision-language. Build: voice assistant.

## Phase 9 — Agentic AI
- [ ] **35 Agents Core** — ReAct, tool calling, memory, planning, reflection. Build: agent from scratch (no framework) that uses 3 tools.
- [ ] **36 Multi-Agent + Protocols** — orchestration, MCP, A2A, frameworks. Build: MCP server + multi-agent research system.
- [ ] **37 Agent Reliability** — evals, guardrails, observability, cost/latency. Build: eval harness for your agent.

## Phase 10 — AI Theory, Safety, Future
- [ ] **38 ANI vs AGI vs ASI** — definitions, current status, benchmarks (ARC-AGI etc.), paths to AGI. Output: written essay w/ your position.
- [ ] **39 Alignment + Safety** — RLHF limits, interpretability (probes, SAEs), robustness, adversarial attacks. Build: probe/jailbreak test on small model.
- [ ] **40 Ethics + Policy** — bias, fairness metrics, privacy, EU AI Act. Build: fairness audit of an earlier model.

## Capstone
- [ ] **41** Combine ≥3 areas (e.g., vision + LLM agent + robot sim). Ship publicly.

---
**Problem sources:** Deep-ML (deep-ml.com, "LeetCode for ML"), Kaggle Learn, CS231n/CS224n/CS285 assignments, Karpathy "Zero to Hero", HF course, Spinning Up (RL), AIMA (Russell & Norvig) exercises.
**Pace:** ~1-2 weeks/topic → ~12-18 months total. Don't skip Phase 0.
