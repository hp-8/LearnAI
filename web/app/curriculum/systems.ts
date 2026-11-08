import { type Field, step, sub, W } from "./types";

const SB: [string, string] = ["Sutton & Barto (free book)", "http://incompleteideas.net/book/the-book-2nd.html"];
const SU: [string, string] = ["OpenAI Spinning Up", "https://spinningup.openai.com/"];
const MR: [string, string] = ["Modern Robotics (Lynch & Park)", "https://hades.mech.northwestern.edu/index.php/Modern_Robotics"];
const PR: [string, string] = ["PythonRobotics", "https://atsushisakai.github.io/PythonRobotics/"];
const arxiv = (id: string) => "https://arxiv.org/abs/" + id;

export const rl: Field = {
  id: "rl", name: "Reinforcement Learning", row: 3, deps: ["ml"],
  project: "An agent that lands LunarLander, with a write-up comparing DQN and PPO",
  subs: [
    sub("Foundations of RL", [SB, ["David Silver's RL course", "https://www.davidsilver.uk/teaching/"]], [
      step("Agents, environments & rewards", "C", "E",
        "An agent acts, the environment returns a new state and a reward, and the agent learns to maximize total future reward. No labels, only consequences.",
        "Reinforcement_learning",
        [["Play an environment", "Run a random agent on Gymnasium CartPole and FrozenLake; log states, actions and rewards.", "You can describe each state and action space."]]),
      step("Bandits & exploration", "B", "E",
        "With several slot machines you must balance trying new arms (explore) and using the best so far (exploit). ε-greedy and UCB are the classic answers.",
        "Multi-armed_bandit",
        [["Bandit showdown", "10-armed bandit with greedy, ε-greedy and UCB; plot average reward and % optimal action.", "UCB and ε-greedy beat greedy; curves shown."]],
        ["Yahoo! news recommendation with bandits", arxiv("1003.0146"), [
          "Contextual bandits picked which article to show on the front page.",
          "Exploration had real cost (clicks) and real benefit (learning new articles).",
          "Offline evaluation from logged data let them test policies safely."]]),
      step("MDPs & the Bellman equation", "T", "M",
        "A Markov decision process formalizes states, actions, transitions and rewards. The Bellman equation says a state's value is the immediate reward plus the discounted value of where you land.",
        "Bellman_equation",
        [["Derive and verify", "Write the Bellman equation for a 3-state MDP, solve it as a linear system, and check by simulating the policy.", "Simulated returns match the solved values."]]),
      step("Dynamic programming", "B", "M",
        "With a known model, value iteration and policy iteration solve MDPs exactly by repeatedly applying the Bellman equation.",
        "Markov_decision_process",
        [["Gridworld", "Value iteration and policy iteration on a 4×4 gridworld with a pit; print arrows.", "Both give the same policy; effect of gamma shown."]]),
    ]),
    sub("Learning from Experience", [SB, SU], [
      step("Monte Carlo & temporal-difference learning", "C", "M",
        "Without a model, estimate values from experience: Monte Carlo waits for the episode's end; TD updates after each step using its own estimate (bootstrapping).",
        "Temporal_difference_learning",
        [["MC vs TD on random walk", "Compare MC and TD(0) on the 5-state random walk from Sutton & Barto.", "RMS error curves reproduce the book's figure."]],
        ["TD-Gammon (1992)", W("TD-Gammon"), [
          "A neural net learned backgammon purely by TD self-play.",
          "Reached near world-champion level and found new strategies humans adopted.",
          "An early proof that RL + function approximation can beat experts."]]),
      step("Q-learning & SARSA", "B", "M",
        "Learn the value of each action in each state. Q-learning learns the optimal policy while exploring (off-policy); SARSA learns the policy it follows (on-policy).",
        "Q-learning",
        [["Cliff walking", "Q-learning vs SARSA on cliff walking; plot the paths each learns.", "Q-learning hugs the cliff, SARSA takes the safe path; you explain why."]]),
    ]),
    sub("Deep RL", [SU, ["CS285 Berkeley", "https://rail.eecs.berkeley.edu/deeprlcourse/"]], [
      step("Deep Q-networks", "B", "H",
        "Replace the Q-table with a neural network. A replay buffer and a target network stop training from chasing its own tail.",
        "Deep_reinforcement_learning",
        [["DQN", "DQN on CartPole then LunarLander; ablate the target network.", "LunarLander average ≥ 200; ablation breaks training."]],
        ["DQN plays Atari (2013)", arxiv("1312.5602"), [
          "One network learned dozens of Atari games from raw pixels and score.",
          "Superhuman on Breakout, hopeless on Montezuma's Revenge (sparse rewards).",
          "Exploration remained the hard open problem."]]),
      step("Policy gradients", "B", "M",
        "Directly adjust a policy network to make high-reward actions more likely (REINFORCE). Works with continuous actions; high variance needs baselines.",
        "Policy_gradient_method",
        [["REINFORCE", "REINFORCE with reward-to-go and a baseline on CartPole.", "Average reward ≥ 475; baseline lowers variance."]]),
      step("Actor-critic & PPO", "C", "H",
        "A critic estimates value to reduce the actor's variance. PPO limits how much the policy changes per update, making it stable enough for robotics and RLHF.",
        "Proximal_policy_optimization",
        [["PPO with a library", "Train PPO (Stable-Baselines3) on LunarLander; compare sample efficiency with your DQN.", "Curves side by side and a short comparison."]],
        ["AlphaGo (2016)", W("AlphaGo"), [
          "Policy and value networks guided Monte Carlo tree search.",
          "Started from human games, then improved by self-play RL.",
          "Move 37 vs Lee Sedol: a move experts called a mistake that won the game."]]),
    ]),
    sub("Multi-Agent RL", [["Multi-Agent RL book", "https://www.marl-book.com/"]], [
      step("Multi-agent RL", "C", "H",
        "Several learning agents share an environment, so each one's world keeps changing as others learn. Cooperation, competition and communication all emerge.",
        "Multi-agent_reinforcement_learning",
        [["Two cooperating agents", "Independent Q-learners in a grid where both must reach goals; plot rewards.", "They learn to cooperate; you explain non-stationarity."]],
        ["OpenAI Five (Dota 2)", W("OpenAI_Five"), [
          "Five PPO agents trained by self-play beat the world champions in 2019.",
          "Used ~45,000 years of game time.",
          "Huge compute substituted for sample efficiency."]]),
    ], true),
  ],
};

export const robotics: Field = {
  id: "rob", name: "Robotics", row: 4, deps: ["rl", "fnd"],
  project: "Simulated robot that localizes itself and plans a path through a maze (PyBullet or ROS 2 + Gazebo)",
  subs: [
    sub("Robot Basics", [MR, ["ROS 2 tutorials", "https://docs.ros.org/en/rolling/Tutorials.html"]], [
      step("Sensors & actuators", "C", "E",
        "Robots sense with cameras, lidar, IMUs and encoders, and act with motors. Every sensor is noisy and every actuator imprecise; robotics is about acting well anyway.",
        "Robotics",
        [["Spec a robot", "For a warehouse robot, list sensors and actuators, what each measures, and its typical noise or failure mode.", "A table you could hand to an engineer."]]),
      step("Coordinate frames & transforms", "B", "M",
        "Every part of a robot has its own frame. Rotation matrices and homogeneous transforms convert points between them.",
        "Transformation_matrix",
        [["Transform chain", "Build 4×4 transforms for world → robot → camera and convert a detected point back to world coordinates.", "Round-trip conversion returns the original point."]]),
    ]),
    sub("Kinematics & Control", [MR], [
      step("Forward kinematics", "B", "E",
        "Given joint angles, compute where the end of the arm is using chained transforms.",
        "Forward_kinematics",
        [["2-link arm", "fk() for a 2-link planar arm; animate it sweeping its joints.", "Hand traces the expected workspace."]]),
      step("Inverse kinematics", "B", "M",
        "Find joint angles that put the hand at a target. Solved analytically for simple arms, iteratively with the Jacobian otherwise.",
        "Inverse_kinematics",
        [["Reach a target", "Jacobian IK for the 2-link arm; click a target and animate reaching it.", "Error under 1 mm for reachable points; sensible failure for unreachable ones."]]),
      step("Feedback control: PID", "B", "E",
        "Correct error using proportional, integral and derivative terms. Controls everything from thermostats to drones.",
        "PID_controller",
        [["Cruise control", "Simulate a car on a hill with PID throttle; tune for 3 settings.", "Overshoot and settling time compared."]]),
    ]),
    sub("Estimation & Planning", [PR, ["Kalman and Bayesian Filters in Python", "https://github.com/rlabbe/Kalman-and-Bayesian-Filters-in-Python"]], [
      step("Bayes filter & Kalman filter", "B", "M",
        "Keep a belief about the state; predict with a motion model, correct with sensors. The Kalman filter is the exact solution for linear-Gaussian systems.",
        "Kalman_filter",
        [["Track an object", "Constant-velocity Kalman filter on noisy 2D measurements.", "Lower error than raw measurements; uncertainty ellipses plotted."]],
        ["Apollo navigation", W("Apollo_Guidance_Computer"), [
          "The Kalman filter was developed into practical use for Apollo's navigation.",
          "It fused onboard measurements with a motion model on a tiny computer.",
          "Same idea now runs in every phone's GPS and every drone."]]),
      step("Particle filters & SLAM", "C", "H",
        "Particle filters represent belief with many samples, handling any distribution. SLAM builds a map while localizing in it.",
        "Simultaneous_localization_and_mapping",
        [["Particle localization", "Particle filter localizing a robot in a known 2D map from range readings.", "Particles converge to the true pose; animation shown."]],
        ["Roomba", W("Roomba"), [
          "Early models used simple bump-and-turn behaviours, no map.",
          "Later models added camera/lidar SLAM to clean systematically.",
          "Cost limits sensors: SLAM had to work with cheap hardware."]]),
      step("Motion planning", "B", "M",
        "Find a collision-free path: grid search (A*) in low dimensions, sampling-based planners (RRT) for arms and complex spaces.",
        "Rapidly_exploring_random_tree",
        [["RRT", "RRT in 2D with obstacles, then shortcut smoothing.", "Collision-free path found; tree plotted."]],
        ["Stanley wins the DARPA Grand Challenge (2005)", W("Stanley_(vehicle)"), [
          "Drove 212 km of desert autonomously.",
          "ML classified drivable terrain from lidar and camera.",
          "Probabilistic sensor fusion beat hand-coded rules."]]),
    ]),
    sub("Robot Learning", [["LeRobot (Hugging Face)", "https://github.com/huggingface/lerobot"]], [
      step("Imitation learning & sim-to-real", "B", "H",
        "Learn from demonstrations (behaviour cloning) or train in simulation and transfer, using domain randomization so the real world looks like one more variation.",
        "Imitation_learning",
        [["Clone an expert", "Collect demos from a trained agent and train a policy by supervised learning.", "Reaches ≥ 80% of the expert's reward."]],
        ["ALVINN (1989)", W("Navlab"), [
          "A small neural net learned to steer a van by watching a human drive.",
          "It failed when the car drifted to states the human never showed it.",
          "That compounding-error problem motivated DAgger and modern imitation methods."]]),
    ]),
  ],
};

export const applied: Field = {
  id: "app", name: "Applied AI", row: 3, deps: ["ml", "ds"],
  project: "Movie recommender with search and an evaluation report",
  subs: [
    sub("Recommender Systems", [["Google: Recommendation systems course", "https://developers.google.com/machine-learning/recommendation"]], [
      step("Collaborative filtering", "B", "M",
        "Recommend what similar users liked, or items similar to what you liked, using only interaction data.",
        "Collaborative_filtering",
        [["MovieLens", "Item-item CF on MovieLens 100k; evaluate precision@10 against 'most popular'.", "Beats the popularity baseline."]]),
      step("Matrix factorization", "B", "M",
        "Compress the user × item matrix into small user and item vectors whose dot product predicts a rating.",
        "Matrix_factorization_(recommender_systems)",
        [["Factorize ratings", "SGD with L2 on observed ratings only.", "Test RMSE below 1.0 on MovieLens 100k."]],
        ["Netflix Prize", W("Netflix_Prize"), [
          "Matrix factorization was the single strongest technique.",
          "Implicit signals (which movies people rated at all) added real accuracy.",
          "Netflix shifted to streaming, where what you watch matters more than star ratings."]]),
    ]),
    sub("Search & Ranking", [["Introduction to Information Retrieval (book)", "https://nlp.stanford.edu/IR-book/"]], [
      step("Search & ranking", "B", "M",
        "Inverted indexes find candidate documents fast; BM25 scores them; learning-to-rank reorders with many signals. NDCG measures the ranking.",
        "Okapi_BM25",
        [["Mini search engine", "Inverted index + BM25 over 1,000 docs; hand-label relevance for 10 queries and compute NDCG@10.", "Matches rank_bm25; NDCG reported."]],
        ["PageRank", W("PageRank"), [
          "Ranked pages by links from other important pages, not just text match.",
          "Made Google results dramatically better than keyword engines of the time.",
          "Spammers then built link farms: every ranking signal gets gamed."]]),
    ]),
    sub("Anomaly Detection", [["scikit-learn: outlier detection", "https://scikit-learn.org/stable/modules/outlier_detection.html"]], [
      step("Anomaly detection", "B", "M",
        "Find rare, unusual points: statistical rules (z-score, IQR), isolation forests, or reconstruction error. Labels are scarce, so evaluation is hard.",
        "Anomaly_detection",
        [["Fraud without labels", "Isolation forest on the credit-card fraud dataset vs a z-score baseline.", "Precision/recall on the fraud class compared."]]),
    ]),
  ],
};

export const mlops: Field = {
  id: "ops", name: "MLOps", row: 4, deps: ["dl"],
  project: "Your house-price model shipped: tracked experiments, API, Docker, CI and a drift monitor",
  subs: [
    sub("Building Reliably", [["Made With ML", "https://madewithml.com/"], ["MLflow docs", "https://mlflow.org/docs/latest/index.html"]], [
      step("Experiment tracking & reproducibility", "B", "E",
        "Record code version, data version, parameters and metrics for every run so results can be reproduced and compared.",
        "MLOps",
        [["Track runs", "Log 10 training runs with MLflow; reproduce the best one from its record alone.", "Reproduced metric matches."]],
        ["Hidden technical debt in ML systems", "https://papers.nips.cc/paper/5656-hidden-technical-debt-in-machine-learning-systems", [
          "The model is a tiny box among data pipelines, config and monitoring.",
          "Entanglement: changing one input changes everything.",
          "Most production ML failures are system failures, not model failures."]]),
    ]),
    sub("Deployment", [["FastAPI docs", "https://fastapi.tiangolo.com/"], ["Docker: get started", "https://docs.docker.com/get-started/"]], [
      step("Serving a model behind an API", "B", "E",
        "Wrap the model in an HTTP endpoint with input validation, so any app can call it.",
        "Web_API",
        [["FastAPI server", "/predict endpoint with a pydantic schema for your house-price model.", "curl works; bad input returns a clear 422."]]),
      step("Containers", "B", "E",
        "Package code, model and dependencies into a container image that runs the same everywhere.",
        "Docker_(software)",
        [["Dockerize", "Slim Dockerfile for the API.", "Runs on a clean machine; image size reported."]]),
      step("CI/CD for ML", "C", "M",
        "Automatically test code, validate data and evaluate the model on every change before it ships.",
        "CI/CD",
        [["GitHub Actions", "Workflow that runs tests, a data-schema check and a minimum-accuracy gate.", "A deliberately bad model fails the pipeline."]],
        ["Knight Capital (2012)", W("Knight_Capital_Group"), [
          "A faulty deployment left old code running on one of eight servers.",
          "It lost about $440M in 45 minutes.",
          "Automated, verified deployment and kill switches are not optional."]]),
    ]),
    sub("Operating Models", [["Evidently: drift guides", "https://www.evidentlyai.com/ml-in-production/data-drift"]], [
      step("Monitoring & data drift", "B", "M",
        "Inputs change after deployment and models silently degrade. Monitor input distributions (PSI, KS test) and outcomes.",
        "Concept_drift",
        [["Drift detector", "psi() and a KS test comparing training data with a shifted copy.", "Same data scores ~0; shifted data flagged."]],
        ["Zillow Offers shutdown (2021)", W("Zillow"), [
          "Zillow bought homes based on its price model, then wound the unit down with large losses.",
          "The market shifted faster than the model adapted.",
          "Acting on predictions at scale amplifies model error."]]),
      step("Efficiency: quantization & distillation", "B", "M",
        "Make models smaller and faster: store weights in 8 bits (quantization) or train a small student to mimic a big teacher (distillation).",
        "Knowledge_distillation",
        [["Shrink a model", "Quantize and distill your CIFAR CNN; compare size, latency and accuracy.", "Table of all three variants."]]),
      step("Distributed training", "B", "H",
        "Split data across GPUs and average gradients (data parallel), or split the model itself when it doesn't fit (model parallel).",
        "Data_parallelism",
        [["DDP", "Convert your FashionMNIST loop to DistributedDataParallel with 2 processes.", "Same accuracy as single process; you explain all-reduce."]]),
    ]),
  ],
};
