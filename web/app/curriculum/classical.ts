import { type Field, step, sub, W } from "./types";

const AIMA: [string, string] = ["AIMA (Russell & Norvig)", "https://aima.cs.berkeley.edu/"];
const CS188: [string, string] = ["Berkeley CS188", "https://inst.eecs.berkeley.edu/~cs188/"];

export const classical: Field = {
  id: "cai", name: "Classical AI", row: 1, deps: ["fnd"],
  project: "Unbeatable Connect-4 bot plus a rule-based PC troubleshooting expert system",
  subs: [
    sub("What AI Is", [AIMA, ["Turing (1950): Computing Machinery and Intelligence", W("Computing_Machinery_and_Intelligence")]], [
      step("The Turing test & definitions of AI", "C", "E",
        "AI has been defined as thinking like humans, acting like humans, thinking rationally, or acting rationally. The Turing test checks the second; most modern AI aims for the last.",
        "Turing_test",
        [["Argue both sides", "Write 300 words: does a chatbot passing a 5-minute Turing test show intelligence? Use one argument from Turing's paper and Searle's Chinese Room.", "Both arguments stated fairly and your own position is explicit."]],
        ["ELIZA (1966)", W("ELIZA"), [
          "Simple pattern-matching rules convinced some users they were understood.",
          "Shows how easily humans attribute intelligence to fluent text (the 'ELIZA effect').",
          "Same effect matters when evaluating modern chatbots."]]),
      step("Agents & environments", "C", "E",
        "An agent perceives its environment through sensors and acts through actuators to maximize a performance measure. Environments differ: observable or not, deterministic or not, single or multi-agent.",
        "Intelligent_agent",
        [["Describe 3 agents", "For a vacuum robot, a chess engine and a self-driving car, write performance measure, environment, actuators, sensors, and classify each environment.", "A table with 3 rows and every property justified."]]),
    ]),
    sub("Search", [CS188, ["Red Blob Games: A*", "https://www.redblobgames.com/pathfinding/a-star/introduction.html"], AIMA], [
      step("Uninformed search: BFS & DFS", "B", "E",
        "Search explores states from a start until it finds a goal. BFS goes level by level and finds the shortest path; DFS dives deep and uses little memory but can get lost.",
        "Breadth-first_search",
        [["Maze solver", "Parse a text maze and solve it with BFS and DFS; print the path and nodes expanded.", "BFS path is shortest; handles a maze with no solution."]]),
      step("Informed search & A*", "T", "M",
        "A* orders nodes by cost-so-far + heuristic estimate. If the heuristic never overestimates (admissible), A* is guaranteed to find the optimal path.",
        "A*_search_algorithm",
        [["A* vs BFS", "Implement A* with Manhattan distance on the same mazes; compare nodes expanded.", "Same path length as BFS, far fewer nodes on a large open maze."],
         ["Break admissibility", "Multiply the heuristic by 3 and find a maze where A* returns a non-optimal path.", "You show the longer path and explain why."]]),
      step("Adversarial search: minimax & alpha-beta", "B", "M",
        "In two-player games, minimax assumes the opponent plays perfectly. Alpha-beta pruning skips moves that cannot change the decision, letting it search roughly twice as deep.",
        "Alpha-beta_pruning",
        [["Unbeatable tic-tac-toe", "Minimax with alpha-beta; play it in the terminal and count nodes with and without pruning.", "It never loses; pruning visits far fewer nodes."]],
        ["Deep Blue vs Kasparov (1997)", W("Deep_Blue_(chess_computer)"), [
          "Alpha-beta search on custom hardware, ~200 million positions per second.",
          "A hand-tuned evaluation function encoded grandmaster knowledge.",
          "Brute-force search worked for chess but not Go, which needed learning (AlphaGo)."]]),
      step("Constraint satisfaction problems", "B", "M",
        "Some problems are about assigning values that satisfy constraints (sudoku, timetables). Backtracking plus constraint propagation (AC-3) solves them far faster than brute force.",
        "Constraint_satisfaction_problem",
        [["Sudoku solver", "Backtracking with AC-3 and minimum-remaining-values ordering.", "Solves a 'hard' sudoku in under a second; backtrack count reported."]]),
    ]),
    sub("Logic & Knowledge", [AIMA, ["CLIPS rule engine", "https://www.clipsrules.net/"]], [
      step("Propositional logic", "C", "E",
        "Facts are true/false symbols combined with AND, OR, NOT, IMPLIES. A knowledge base entails a sentence if the sentence is true in every world where the KB is true.",
        "Propositional_calculus",
        [["Truth-table entailment", "Check entailment by enumerating models for the Wumpus-world knowledge base in AIMA.", "Correctly decides 3 queries; prints the models checked."]]),
      step("First-order logic & inference", "C", "M",
        "First-order logic adds objects, relations and 'for all / there exists'. Inference uses unification to match patterns like Parent(x, Bob). This is the core of Prolog.",
        "First-order_logic",
        [["Unify and chain", "Write unify() with occurs check, then forward chaining over FOL rules for a family tree.", "Derives Grandparent facts correctly; unify fails on X vs f(X)."]],
        ["IBM Watson on Jeopardy! (2011)", W("IBM_Watson"), [
          "Combined many parsers, knowledge bases and statistical scorers rather than one logic engine.",
          "Ranking candidate answers by confidence decided when to buzz in.",
          "Its later struggles in healthcare show the gap between a benchmark and real deployment."]]),
      step("Expert systems", "B", "M",
        "An expert system stores specialist knowledge as if-then rules and an inference engine applies them. Explaining which rules fired is what made them trusted.",
        "Expert_system",
        [["PC troubleshooter", "Ask yes/no questions, chain rules to a diagnosis and answer 'why?' with the rules that fired.", "15+ rules, 4 diagnoses, correct 'why' trace for each."]],
        ["MYCIN", W("Mycin"), [
          "About 600 rules diagnosed blood infections and suggested antibiotics.",
          "Certainty factors handled uncertainty without full probability theory.",
          "Matched experts in tests but was never used clinically: liability and integration, not accuracy, blocked it."]]),
    ]),
    sub("Uncertainty & Fuzzy Logic", [["scikit-fuzzy", "https://pythonhosted.org/scikit-fuzzy/"], ["Fuzzy logic overview", W("Fuzzy_logic")]], [
      step("Fuzzy sets & fuzzy control", "B", "M",
        "In fuzzy logic a value belongs to a set by degree (22°C is 0.7 'warm'). Rules like 'if hot then fan fast' are combined and defuzzified into one control output.",
        "Fuzzy_control_system",
        [["Fan controller", "Membership functions for temperature and humidity, 6 rules, centroid defuzzification, no libraries.", "Smooth output as inputs sweep; matches scikit-fuzzy within 1% on 5 inputs."]],
        ["Sendai Subway (1987)", W("Sendai_Subway_Namboku_Line"), [
          "Fuzzy control ran acceleration and braking.",
          "Rides were smoother and used less energy than with human drivers.",
          "Fuzzy rules let engineers encode operator know-how directly."]]),
    ]),
    sub("Local & Evolutionary Search", [["The Nature of Code", "https://natureofcode.com/"]], [
      step("Hill climbing & simulated annealing", "B", "E",
        "Local search improves one candidate step by step. Hill climbing gets stuck on local peaks; simulated annealing sometimes accepts worse moves early to escape them.",
        "Simulated_annealing",
        [["8-queens", "Solve 8-queens with hill climbing (with restarts) and with simulated annealing; compare success rates over 100 runs.", "Table of success rate and average steps."]]),
      step("Genetic algorithms", "B", "M",
        "Evolve a population of candidates with selection, crossover and mutation. Useful when the search space is huge and gradients don't exist.",
        "Genetic_algorithm",
        [["Evolve a TSP route", "GA for 30 cities with order crossover and swap mutation; plot the best route every 50 generations.", "Within 10% of a 2-opt baseline."]],
        ["NASA's evolved antenna", W("Evolved_antenna"), [
          "A GA designed the antenna for the ST5 spacecraft (2006).",
          "The result looked bizarre to engineers but met specs better than human designs.",
          "Fitness was a simulator score: the GA is only as good as what you measure."]]),
    ]),
    sub("Game Theory", [["Yale ECON 159: Game Theory", "https://oyc.yale.edu/economics/econ-159"]], [
      step("Nash equilibrium", "T", "M",
        "A Nash equilibrium is a strategy profile where no player gains by changing alone. Nash proved every finite game has at least one (possibly mixed).",
        "Nash_equilibrium",
        [["Solve 2×2 games", "Find pure equilibria by best responses and mixed ones by the indifference condition.", "Correct for Prisoner's Dilemma, Matching Pennies and Battle of the Sexes."]]),
    ], true),
  ],
};

const KG = (s: string): [string, string] => ["Kaggle Learn: " + s, "https://www.kaggle.com/learn/" + s.toLowerCase().replace(/ /g, "-")];

export const dataScience: Field = {
  id: "ds", name: "Data Science", row: 1, deps: ["fnd"],
  project: "End-to-end analysis of a public dataset: question → SQL/pandas → charts → statistical test → written findings",
  subs: [
    sub("Getting Data", [["SQLBolt", "https://sqlbolt.com/"], KG("Intro to SQL"), KG("Pandas")], [
      step("The data science lifecycle", "C", "E",
        "Question → collect → clean → explore → model → communicate. Most time goes to cleaning; most value comes from asking the right question.",
        "Cross-industry_standard_process_for_data_mining",
        [["Plan an analysis", "Pick a public dataset and write a one-page plan: the question, data sources, likely problems and what a useful answer looks like.", "A plan someone else could follow."]]),
      step("SQL", "B", "E",
        "SQL queries tables: filter, join, group and aggregate. Window functions (ROW_NUMBER, LAG) handle rankings and time comparisons.",
        "SQL",
        [["Top 3 per category", "In SQLite, return the top 3 products by revenue in each category with ROW_NUMBER() OVER (PARTITION BY …).", "Correct on a 50-row table including ties."],
         ["Retention cohorts", "From events(user_id, date), output signup month × months since signup with % active.", "Month 0 is 100% for every cohort."]]),
      step("Pandas wrangling", "B", "E",
        "Pandas is SQL in Python: filter rows, select columns, groupby-aggregate, merge tables, reshape with pivot and melt.",
        "Pandas_(software)",
        [["Orders report", "Revenue per country per month and month-over-month % change from orders + customers tables.", "Matches a manual check on two countries."]]),
    ]),
    sub("Cleaning & Exploring", [KG("Data Visualization"), ["Fundamentals of Data Visualization (book)", "https://clauswilke.com/dataviz/"]], [
      step("Cleaning & missing data", "B", "E",
        "Real data has gaps, duplicates, wrong types and outliers. Whether data is missing at random decides if dropping or imputing biases your answer.",
        "Imputation_(statistics)",
        [["Clean Titanic", "Report missing % per column, impute Age by passenger class, handle Cabin, cap Fare outliers; justify each choice.", "No NaNs in used columns and a written note on the bias each choice introduces."]]),
      step("Exploratory analysis & visualization", "B", "E",
        "Look before you model: distributions, relationships, outliers. Choose the chart for the comparison you want the reader to make.",
        "Exploratory_data_analysis",
        [["Three-chart story", "Answer one question about a dataset with exactly three charts that build on each other, each with a takeaway title.", "A reader states your conclusion in 30 seconds."]],
        ["John Snow's cholera map (1854)", W("1854_Broad_Street_cholera_outbreak"), [
          "Plotting deaths on a street map pointed to one water pump.",
          "The anomalies (brewery workers who didn't die drank beer) strengthened the case.",
          "A simple chart of the right data beat the prevailing theory."]]),
      step("Sampling & bias", "C", "M",
        "Who ends up in your data decides what you can conclude. Selection, survivorship and non-response bias quietly flip results.",
        "Sampling_bias",
        [["Simulate survivorship bias", "Simulate startups with random skill and luck; analyse only the survivors and show how luck looks like skill.", "Plot of the full vs survivor-only relationship."]],
        ["Wald and the bomber armor", W("Survivorship_bias"), [
          "Planes returning from missions had bullet holes in certain places.",
          "Wald argued to armor where returning planes had no holes: those hit there never came back.",
          "Ask what data you are not seeing before drawing conclusions."]]),
    ]),
    sub("Experiments", [["Evan Miller: A/B testing", "https://www.evanmiller.org/ab-testing/"], ["HBR: The surprising power of online experiments", "https://hbr.org/2017/09/the-surprising-power-of-online-experiments"]], [
      step("A/B testing", "B", "M",
        "Randomly split users, change one thing, compare. A two-proportion z-test tells you if the difference is bigger than chance; sample size decides if you could have seen it.",
        "A/B_testing",
        [["Test by hand", "Control 200/2000, variant 250/2000: compute z and p by formula, then verify with statsmodels.", "Numbers match; ship decision stated."],
         ["Sample size & peeking", "Compute sample size for a 10% relative lift, then simulate stopping as soon as p < 0.05 and measure the false-positive rate.", "Peeking gives far more than 5% false positives."]],
        ["Bing's $100M headline test", "https://hbr.org/2017/09/the-surprising-power-of-online-experiments", [
          "A small change to ad headlines, deprioritized for months, raised revenue ~12%.",
          "Experts' intuition about which ideas would win was usually wrong.",
          "Running many cheap experiments beat debating in meetings."]]),
    ]),
    sub("Time Series", [["Forecasting: Principles and Practice", "https://otexts.com/fpp3/"]], [
      step("Forecasting basics", "B", "M",
        "Time series have trend, seasonality and noise. Always beat a naive baseline (last value, moving average) before trying ARIMA or ML.",
        "Time_series",
        [["Baselines then ARIMA", "Forecast the last 12 months of a monthly series with naive, moving-average and ARIMA; report MAE for each.", "Table of MAE; ARIMA beats baselines or you explain why not."]],
        ["Makridakis forecasting competitions", W("Makridakis_Competitions"), [
          "Simple statistical methods often beat complex ones in early competitions.",
          "Combining forecasts was consistently strong.",
          "Later rounds showed ML only wins with lots of related series."]]),
    ], true),
    sub("Big Data", [["Spark quick start", "https://spark.apache.org/docs/latest/quick-start.html"]], [
      step("MapReduce & Spark", "B", "M",
        "When data doesn't fit on one machine, split it, process pieces in parallel (map), then combine (reduce). Spark keeps data in memory between steps.",
        "Apache_Spark",
        [["Word count & join", "PySpark word count on a book, then join 5M generated orders with 100k customers, comparing a normal and a broadcast join.", "Same results; timing difference noted from the Spark UI."]],
        ["Google's MapReduce", W("MapReduce"), [
          "Indexing the web needed thousands of cheap machines that often failed.",
          "The framework hid failure handling so engineers just wrote map and reduce.",
          "Hadoop and later Spark brought the idea to everyone."]]),
    ], true),
  ],
};
