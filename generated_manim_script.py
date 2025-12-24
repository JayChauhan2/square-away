from manim import *

class Explainer(Scene):
    def construct(self):
        # Step 1: Introduction
        title = Tex("Chain Rule and Applications", color=BLUE)
        intro = Tex("A fundamental rule for differentiating composite functions", color=YELLOW)
        intro.next_to(title, DOWN)
        self.play(Write(title))
        self.wait(1)
        self.play(Write(intro))
        self.wait(2)
        self.clear()

        # Step 2: Example 1
        example1_title = Tex("Example 1:", color=GREEN)
        example1_eq = MathTex("y = \\sqrt[7]{\\log \\left(\\frac{1}{x}\\right)}", color=RED)
        example1_eq.next_to(example1_title, DOWN)
        self.play(Write(example1_title))
        self.play(Write(example1_eq))
        self.wait(2)

        # Step 3: Differentiation steps for Example 1
        step1 = MathTex("\\frac{dy}{dx} = \\frac{1}{7} \\left(\\log \\left(\\frac{1}{x}\\right)\\right)^{-\\frac{6}{7}} \\frac{d}{dx} \\log \\left(\\frac{1}{x}\\right)", color=PURPLE)
        step1.next_to(example1_eq, DOWN)
        self.play(Write(step1))
        self.wait(2)

        step2 = MathTex("= -\\frac{1}{7} \\left(\\log \\left(\\frac{1}{x}\\right)\\right)^{-\\frac{6}{7}} \\frac{d}{dx} \\log x", color=ORANGE)
        step2.next_to(step1, DOWN)
        self.play(Write(step2))
        self.wait(2)

        step3 = MathTex("= -\\frac{1}{7} \\left(\\log \\left(\\frac{1}{x}\\right)\\right)^{-\\frac{6}{7}} \\frac{1}{x}", color=TEAL)
        step3.next_to(step2, DOWN)
        self.play(Write(step3))
        self.wait(2)

        # Step 4: Final derivative for Example 1
        final1 = MathTex("\\frac{dy}{dx} = - \\frac{1}{7x \\left(\\log \\left(\\frac{1}{x}\\right)\\right)^{\\frac{6}{7}}}", color=GOLD)
        final1.next_to(step3, DOWN)
        self.play(Write(final1))
        self.wait(2)
        self.clear()

        # Step 5: Example 2
        example2_title = Tex("Example 2:", color=GREEN)
        example2_eq = MathTex("y = \\sin^4 x + \\sin(x^4) + \\sin 4x + x^4", color=RED)
        example2_eq.next_to(example2_title, DOWN)
        self.play(Write(example2_title))
        self.play(Write(example2_eq))
        self.wait(2)

        # Step 6: Differentiation steps for Example 2
        step1_2 = MathTex("\\frac{dy}{dx} = 4 \\sin^3 x \\frac{d}{dx} (\\sin x) + \\cos(x^4) \\frac{d}{dx} (x^4) + 4 \\cos 4x + 4x^3", color=PURPLE)
        step1_2.next_to(example2_eq, DOWN)
        self.play(Write(step1_2))
        self.wait(2)

        step2_2 = MathTex("= 4 \\sin^3 x \\cos x + \\cos(x^4) (4x^3) + 4 \\cos 4x + 4x^3", color=ORANGE)
        step2_2.next_to(step1_2, DOWN)
        self.play(Write(step2_2))
        self.wait(2)

        # Step 7: Final derivative for Example 2
        final2 = MathTex("= 4 \\cos x \\sin^3 x + 4x^3 \\cos(x^4) + 4 \\cos 4x + 4x^3", color=GOLD)
        final2.next_to(step2_2, DOWN)
        self.play(Write(final2))
        self.wait(2)
        self.clear()

        # Step 8: Summary
        summary = Tex("Chain Rule Applications", color=BLUE)
        summary.to_edge(UP)
        points = VGroup(
            Tex("1. Differentiate composite functions", color=YELLOW),
            Tex("2. Break down complex derivatives step-by-step", color=YELLOW),
            Tex("3. Essential for calculus and real-world applications", color=YELLOW)
        )
        points.arrange(DOWN, aligned_edge=LEFT)
        self.play(Write(summary))
        self.play(Write(points))
        self.wait(3)

        self.wait(1)  # Total duration placeholder