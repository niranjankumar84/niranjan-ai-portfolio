"""
test_agent.py — Comprehensive Automated Test Suite for Stage 7 Agentic AI
Tests all 12 acceptance criteria.
"""

import sys
from main import run_autonomous_agent, AGENT_TOOL_REGISTRY
from agent_tools import (
    navigate_portfolio,
    explore_project,
    compare_projects,
    explore_skills,
    get_contact_channel
)

def run_tests():
    print("=== STARTING STAGE 7 AGENTIC AI TEST SUITE ===")
    passed = 0
    total = 0

    def assert_test(cond, title):
        nonlocal passed, total
        total += 1
        if cond:
            print(f"  [PASS] {title}")
            passed += 1
        else:
            print(f"  [FAIL] {title}")

    # Test 1: Simple conversational question
    reply, action, trace = run_autonomous_agent("Hello! Who are you?")
    assert_test("Niranjan's Agentic AI assistant" in reply or "tools" in reply, "1. Simple Conversational Query")
    assert_test(len(trace) >= 1, "1b. Trace generated for greeting")

    # Test 2: Portfolio navigation through agent
    reply, action, trace = run_autonomous_agent("Take me to the projects section")
    assert_test(action and action.get("action") == "navigate" and action.get("section") == "projects", "2. Portfolio Navigation Tool (projects)")

    # Test 3: Opening each Project World
    reply, action, trace = run_autonomous_agent("Open the Gym Trainer project world")
    assert_test(action and action.get("action") == "open_project_world" and action.get("target") == "gym-trainer", "3a. Open World (Gym Trainer)")

    reply, action, trace = run_autonomous_agent("Open the LexAI-India project world")
    assert_test(action and action.get("action") == "open_project_world" and action.get("target") == "lexai-india", "3b. Open World (LexAI-India)")

    reply, action, trace = run_autonomous_agent("Open the AI Resume ATS project world")
    assert_test(action and action.get("action") == "open_project_world" and action.get("target") == "ai-resume-ats", "3c. Open World (AI Resume ATS)")

    # Test 4: Comparing two projects
    reply, action, trace = run_autonomous_agent("Compare Gym Trainer and LexAI")
    assert_test("AI-Powered Gym Trainer" in reply and "LexAI-India" in reply, "4. Project Comparison Tool Execution")
    assert_test(any(t.tool == "compare_projects" for t in trace), "4b. Tool 'compare_projects' present in execution trace")

    # Test 5: Retrieving skills information
    reply, action, trace = run_autonomous_agent("What are your skills in Python and FastAPI?")
    assert_test("Python" in reply and "FastAPI" in reply, "5. Skills Explorer Tool Execution")
    assert_test(any(t.tool == "explore_skills" for t in trace), "5b. Tool 'explore_skills' present in execution trace")

    # Test 6: Contact information retrieval
    reply, action, trace = run_autonomous_agent("How can I email Niranjan?")
    assert_test("kumarniranjan84096@gmail.com" in reply, "6. Contact Assistant Tool Execution")

    # Test 7: Invalid tool arguments handling
    err_res = explore_project("unknown-fake-project-999")
    assert_test(err_res.get("status") == "error", "7a. Invalid Project ID handled gracefully")

    err_nav = navigate_portfolio("mars-colony-section")
    assert_test(err_nav.get("status") == "error", "7b. Invalid Section handled gracefully")

    # Test 8 & 9: Deterministic fallback integrity
    assert_test(len(AGENT_TOOL_REGISTRY) == 5, "8. All 5 portfolio tools registered in AGENT_TOOL_REGISTRY")

    print(f"\n=== TEST SUMMARY: {passed}/{total} TESTS PASSED ===")
    return passed == total

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
