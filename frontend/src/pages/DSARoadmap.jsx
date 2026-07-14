import React, { useState, useEffect } from 'react';
import '../styles/InteractiveRoadmap.css'; // Make sure this path is correct!

const DSA_ROADMAP_DATA = [
  {
    id: 'sec-1',
    title: 'Phase 1: Foundations & Arrays',
    topics: [
      { id: 'dsa-1', title: 'Time & Space Complexity Analysis', difficulty: 'Easy', time: '2h' },
      { id: 'dsa-2', title: 'Language Standard Libraries (e.g., C++ STL)', difficulty: 'Easy', time: '3h' },
      { id: 'dsa-3', title: 'Basic Math & Bit Manipulation', difficulty: 'Medium', time: '4h' },
      { id: 'dsa-4', title: 'Array Manipulation & Prefix Sums', difficulty: 'Medium', time: '5h' },
      { id: 'dsa-5', title: 'Sliding Window (Fixed & Variable)', difficulty: 'Medium', time: '4h' },
    ]
  },
  {
    id: 'sec-2',
    title: 'Phase 2: Two Pointers & Searching',
    topics: [
      { id: 'dsa-6', title: 'Two Pointers Pattern', difficulty: 'Easy', time: '3h' },
      { id: 'dsa-7', title: 'Binary Search on 1D Arrays', difficulty: 'Easy', time: '3h' },
      { id: 'dsa-8', title: 'Binary Search on Answer Space', difficulty: 'Hard', time: '5h' },
      { id: 'dsa-9', title: 'Sorting Algorithms (Merge, Quick, Heap)', difficulty: 'Medium', time: '4h' },
    ]
  },
  {
    id: 'sec-3',
    title: 'Phase 3: Linked Lists & Stacks',
    topics: [
      { id: 'dsa-10', title: 'Singly & Doubly Linked Lists', difficulty: 'Easy', time: '2h' },
      { id: 'dsa-11', title: 'Fast & Slow Pointers (Tortoise & Hare)', difficulty: 'Medium', time: '3h' },
      { id: 'dsa-12', title: 'Stack & Queue Implementations', difficulty: 'Easy', time: '2h' },
      { id: 'dsa-13', title: 'Monotonic Stack / Queue', difficulty: 'Hard', time: '5h' },
    ]
  },
  {
    id: 'sec-4',
    title: 'Phase 4: Trees & Tries',
    topics: [
      { id: 'dsa-14', title: 'Binary Tree Traversals (In/Pre/Post/Level)', difficulty: 'Easy', time: '3h' },
      { id: 'dsa-15', title: 'Binary Search Trees (BST)', difficulty: 'Medium', time: '3h' },
      { id: 'dsa-16', title: 'Lowest Common Ancestor (LCA)', difficulty: 'Medium', time: '2h' },
      { id: 'dsa-17', title: 'Trie (Prefix Tree) Implementation', difficulty: 'Medium', time: '4h' },
    ]
  },
  {
    id: 'sec-5',
    title: 'Phase 5: Graphs & Heaps',
    topics: [
      { id: 'dsa-18', title: 'Priority Queues & Heaps', difficulty: 'Medium', time: '3h' },
      { id: 'dsa-19', title: 'Graph Representations & BFS/DFS', difficulty: 'Medium', time: '4h' },
      { id: 'dsa-20', title: 'Topological Sorting & Kahn’s Algorithm', difficulty: 'Medium', time: '3h' },
      { id: 'dsa-21', title: 'Shortest Path (Dijkstra & Bellman-Ford)', difficulty: 'Hard', time: '6h' },
      { id: 'dsa-22', title: 'Disjoint Set (Union-Find) & MST', difficulty: 'Hard', time: '5h' },
    ]
  },
  {
    id: 'sec-6',
    title: 'Phase 6: Dynamic Programming & Backtracking',
    topics: [
      { id: 'dsa-23', title: 'Recursion & Backtracking (Subsets, Permutations)', difficulty: 'Medium', time: '5h' },
      { id: 'dsa-24', title: '1D Dynamic Programming (Memoization vs Tabulation)', difficulty: 'Medium', time: '4h' },
      { id: 'dsa-25', title: '2D Dynamic Programming (Grids & Strings)', difficulty: 'Hard', time: '6h' },
      { id: 'dsa-26', title: '0/1 Knapsack & Unbounded Knapsack Patterns', difficulty: 'Hard', time: '5h' },
    ]
  }
];

const DSARoadmap = () => {
  // Load saved progress using a UNIQUE KEY for DSA
  const [completedTopics, setCompletedTopics] = useState(() => {
    const saved = localStorage.getItem('dsa-roadmap-progress');
    return saved ? JSON.parse(saved) : {};
  });

  const [openSections, setOpenSections] = useState({ 'sec-1': true });

  // Save to local storage whenever progress changes
  useEffect(() => {
    localStorage.setItem('dsa-roadmap-progress', JSON.stringify(completedTopics));
  }, [completedTopics]);

  const toggleTopic = (topicId) => {
    setCompletedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const totalTopics = DSA_ROADMAP_DATA.reduce((acc, section) => acc + section.topics.length, 0);
  const completedCount = Object.values(completedTopics).filter(Boolean).length;
  const progressPercentage = totalTopics === 0 ? 0 : Math.round((completedCount / totalTopics) * 100);

  return (
    <div className="roadmap-page dark-theme">
      
      <div className="roadmap-header">
        <h1>Data Structures & Algorithms</h1>
        <p>Master problem-solving patterns from Arrays to Dynamic Programming to crack top tech interviews.</p>
        
        <div className="progress-container">
          <div className="progress-stats">
            <span>Overall Progress</span>
            <span>{progressPercentage}% ({completedCount}/{totalTopics})</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>
      </div>

      <div className="roadmap-content">
        {DSA_ROADMAP_DATA.map((section) => {
          const isSectionOpen = openSections[section.id];
          const sectionTotal = section.topics.length;
          const sectionCompleted = section.topics.filter(t => completedTopics[t.id]).length;
          const isSectionDone = sectionTotal === sectionCompleted;

          return (
            <div key={section.id} className={`roadmap-section ${isSectionDone ? 'section-completed' : ''}`}>
              
              <button className="section-header" onClick={() => toggleSection(section.id)}>
                <div className="section-header-left">
                  <span className="toggle-icon">{isSectionOpen ? '▼' : '▶'}</span>
                  <h3>{section.title}</h3>
                </div>
                <div className="section-header-right">
                  <span className="section-stats">{sectionCompleted}/{sectionTotal}</span>
                </div>
              </button>

              {isSectionOpen && (
                <div className="section-body">
                  {section.topics.map((topic) => {
                    const isDone = completedTopics[topic.id];
                    return (
                      <div key={topic.id} className={`topic-row ${isDone ? 'done' : ''}`} onClick={() => toggleTopic(topic.id)}>
                        <div className="topic-left">
                          <div className={`custom-checkbox ${isDone ? 'checked' : ''}`}>
                            {isDone && '✓'}
                          </div>
                          <span className="topic-title">{topic.title}</span>
                        </div>
                        
                        <div className="topic-right">
                          <span className={`difficulty-tag ${topic.difficulty.toLowerCase()}`}>
                            {topic.difficulty}
                          </span>
                          <span className="time-tag">⏱ {topic.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DSARoadmap;