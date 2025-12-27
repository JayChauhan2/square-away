from manim import *

class Explainer(Scene):
    def construct(self):
        # Step 1: Introduction
        title = Tex("Chain Rule and Applications", color=BLUE)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        # Step 2: Problem Statement
        problem1 = MathTex(
            "y = \\sqrt[7]{\\log\\left(\\frac{1}{x}\\right)}",
            color=GREEN
        )
        self.play(Write(problem1))
        self.wait(2)

        # Step 3: Step-by-Step Solution
        step1 = MathTex(
            "\\frac{dy}{dx} = \\frac{1}{7} \\left(\\log\\left(\\frac{1}{x}\\right)\\right)^{\\frac{1}{7}-1} \\cdot \\frac{d}{dx} \\left(\\log\\left(\\frac{1}{x}\\right)\\right)",
            color=YELLOW
        )
        self.play(Transform(problem1, step1))
        self.wait(2)

        step2 = MathTex(
            "\\frac{dy}{dx} = \\frac{1}{7} \\left(\\log\\left(\\frac{1}{x}\\right)\\right)^{-\\frac{6}{7}} \\cdot \\frac{d}{dx} \\left(\\log(x^{-1})\\right)",
            color=YELLOW
        )
        self.play(Transform(problem1, step2))
        self.wait(2)

        step3 = MathTex(
            "\\frac{dy}{dx} = \\frac{1}{7} \\left(\\log\\left(\\frac{1}{x}\\right)\\right)^{-\\frac{6}{7}} \\cdot \\frac{d}{dx} (-\\log x)",
            color=YELLOW
        )
        self.play(Transform(problem1, step3))
        self.wait(2)

        step4 = MathTex(
            "\\frac{dy}{dx} = -\\frac{1}{7} \\left(\\log\\left(\\frac{1}{x}\\right)\\right)^{-\\frac{6}{7}} \\cdot \\frac{1}{x}",
            color=YELLOW
        )
        self.play(Transform(problem1, step4))
        self.wait(2)

        step5 = MathTex(
            "\\frac{dy}{dx} = -\\frac{1}{7x \\left(\\log\\left(\\frac{1}{x}\\right)\\right)^{\\frac{6}{7}}}",
            color=YELLOW
        )
        self.play(Transform(problem1, step5))
        self.wait(2)
        self.play(FadeOut(problem1))

        # Step 4: Implicit Differentiation Problem
        problem2 = MathTex(
            "y = \\sin^4x + \\sin(x^4) + \\sin 4x + x^4",
            color=GREEN
        )
        self.play(Write(problem2))
        self.wait(2)

        # Step 5: Step-by-Step Solution
        step1_2 = MathTex(
            "\\frac{dy}{dx} = \\frac{d}{dx}(\\sin^4x) + \\frac{d}{dx}(\\sin(x^4)) + \\frac{d}{dx}(\\sin 4x) + \\frac{d}{dx}(x^4)",
            color=YELLOW
        )
        self.play(Transform(problem2, step1_2))
        self.wait(2)

        step2_2 = MathTex(
            "\\frac{dy}{dx} = 4\\sin^3x \\cdot \\frac{d}{dx}(\\sin x) + \\cos(x^4) \\cdot \\frac{d}{dx}(x^4) + \\cos(4x) \\cdot \\frac{d}{dx}(4x) + 4x^3",
            color=YELLOW
        )
        self.play(Transform(problem2, step2_2))
        self.wait(2)

        step3_2 = MathTex(
            "\\frac{dy}{dx} = 4\\sin^3x \\cdot \\cos x + \\cos(x^4) \\cdot (4x^3) + \\cos(4x) \\cdot 4 + 4x^3",
            color=YELLOW
        )
        self.play(Transform(problem2, step3_2))
        self.wait(2)

        step4_2 = MathTex(
            "\\frac{dy}{dx} = 4\\cos x \\sin^3x + 4x^3\\cos(x^4) + 4\\cos(4x) + 4x^3",
            color=YELLOW
        )
        self.play(Transform(problem2, step4_2))
        self.wait(2)
        self.play(FadeOut(problem2))

        # Step 6: Summary
        summary = Tex("Chain Rule: Differentiate composite functions step-by-step", color=BLUE)
        self.play(Write(summary))
        self.wait(2)
        self.play(FadeOut(summary))

        self.wait(1)