from manim import *

class Explainer(Scene):
    def construct(self):
        # Step 1: Introduction
        title = Tex("Chain Rule and Applications", color=BLUE)
        subtitle = Tex("Differentiating Composite Functions", color=YELLOW).next_to(title, DOWN)
        self.play(Write(title), Write(subtitle))
        self.wait(2)
        self.play(FadeOut(title), FadeOut(subtitle))

        # Problem 1
        prob1_title = Tex("Problem 1", color=GREEN).to_edge(UP)
        func1 = MathTex("y = \\sqrt[7]{\\log\\left(\\frac{1}{x}\\right)}", color=RED).scale(1.2)
        self.play(Write(prob1_title), Write(func1))
        self.wait(2)

        # Step 1: Rewrite
        step1 = Tex("Step 1: Rewrite using exponent notation", color=PURPLE).next_to(prob1_title, DOWN)
        rewrite1 = MathTex("y = \\left(\\log\\left(x^{-1}\\right)\\right)^{\\frac{1}{7}}", color=ORANGE)
        rewrite2 = MathTex("y = (-\\log x)^{\\frac{1}{7}}", color=ORANGE)
        self.play(Write(step1))
        self.wait(1)
        self.play(Transform(func1, rewrite1))
        self.wait(1)
        self.play(Transform(func1, rewrite2))
        self.wait(2)
        self.play(FadeOut(step1))

        # Step 2: Chain Rule
        step2 = Tex("Step 2: Apply Chain Rule", color=PURPLE).next_to(prob1_title, DOWN)
        chain_rule = MathTex("\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}", color=TEAL)
        u_def = MathTex("u = -\log x", color=TEAL)
        f_def = MathTex("f(u) = u^{\\frac{1}{7}}", color=TEAL)
        dy_du = MathTex("\\frac{dy}{du} = \\frac{1}{7} u^{-\\frac{6}{7}}", color=TEAL)
        du_dx = MathTex("\\frac{du}{dx} = -\frac{1}{x}", color=TEAL)

        self.play(Write(step2))
        self.wait(1)
        self.play(Write(chain_rule))
        self.wait(1)
        self.play(Write(u_def), Write(f_def))
        self.wait(1)
        self.play(Write(dy_du), Write(du_dx))
        self.wait(2)
        self.play(FadeOut(step2), FadeOut(chain_rule), FadeOut(u_def), FadeOut(f_def), FadeOut(dy_du), FadeOut(du_dx))

        # Step 3: Combine
        step3 = Tex("Step 3: Combine derivatives", color=PURPLE).next_to(prob1_title, DOWN)
        combine1 = MathTex("\\frac{dy}{dx} = \\frac{1}{7} (-\log x)^{-\\frac{6}{7}} \\cdot \\left(-\frac{1}{x}\\right)", color=GOLD)
        combine2 = MathTex("\\frac{dy}{dx} = -\frac{1}{7x} (-\log x)^{-\\frac{6}{7}}", color=GOLD)

        self.play(Write(step3))
        self.wait(1)
        self.play(Write(combine1))
        self.wait(1)
        self.play(Transform(combine1, combine2))
        self.wait(2)
        self.play(FadeOut(step3), FadeOut(combine1))

        # Step 4: Convert back
        step4 = Tex("Step 4: Convert back to original form", color=PURPLE).next_to(prob1_title, DOWN)
        convert = MathTex("\\frac{dy}{dx} = -\frac{1}{7x} \\left(\log\\left(\\frac{1}{x}\\right)\\right)^{-\\frac{6}{7}}", color=MAROON)

        self.play(Write(step4))
        self.wait(1)
        self.play(Write(convert))
        self.wait(2)
        self.play(FadeOut(step4), FadeOut(convert))

        # Step 5: Final form
        step5 = Tex("Step 5: Write with positive exponent", color=PURPLE).next_to(prob1_title, DOWN)
        final = MathTex("\\frac{dy}{dx} = -\frac{1}{7x \\left(\log\\left(\\frac{1}{x}\\right)\\right)^{\\frac{6}{7}}}", color=GREEN)

        self.play(Write(step5))
        self.wait(1)
        self.play(Write(final))
        self.wait(2)
        self.play(FadeOut(prob1_title), FadeOut(func1), FadeOut(step5), FadeOut(final))

        # Problem 2
        prob2_title = Tex("Problem 2", color=GREEN).to_edge(UP)
        func2 = MathTex("y = \\sin^4 x + \\sin(x^4) + \\sin(4x) + x^4", color=RED).scale(1.2)
        self.play(Write(prob2_title), Write(func2))
        self.wait(2)

        # Step 1: sin^4 x
        step1_2 = Tex("Step 1: Derivative of sin^4 x", color=PURPLE).next_to(prob2_title, DOWN)
        sin4_deriv = MathTex("\\frac{d}{dx}(\\sin x)^4 = 4 \\sin^3 x \\cos x", color=ORANGE)

        self.play(Write(step1_2))
        self.wait(1)
        self.play(Write(sin4_deriv))
        self.wait(2)
        self.play(FadeOut(step1_2))

        # Step 2: sin(x^4)
        step2_2 = Tex("Step 2: Derivative of sin(x^4)", color=PURPLE).next_to(prob2_title, DOWN)
        sinx4_deriv = MathTex("\\frac{d}{dx}(\\sin(x^4)) = 4x^3 \\cos(x^4)", color=TEAL)

        self.play(Write(step2_2))
        self.wait(1)
        self.play(Write(sinx4_deriv))
        self.wait(2)
        self.play(FadeOut(step2_2))

        # Step 3: sin(4x)
        step3_2 = Tex("Step 3: Derivative of sin(4x)", color=PURPLE).next_to(prob2_title, DOWN)
        sin4x_deriv = MathTex("\\frac{d}{dx}(\\sin(4x)) = 4 \\cos(4x)", color=GOLD)

        self.play(Write(step3_2))
        self.wait(1)
        self.play(Write(sin4x_deriv))
        self.wait(2)
        self.play(FadeOut(step3_2))

        # Step 4: x^4
        step4_2 = Tex("Step 4: Derivative of x^4", color=PURPLE).next_to(prob2_title, DOWN)
        x4_deriv = MathTex("\\frac{d}{dx}(x^4) = 4x^3", color=MAROON)

        self.play(Write(step4_2))
        self.wait(1)
        self.play(Write(x4_deriv))
        self.wait(2)
        self.play(FadeOut(step4_2))

        # Final combined derivative
        final_deriv = MathTex("\\frac{dy}{dx} = 4 \\sin^3 x \\cos x + 4x^3 \\cos(x^4) + 4 \\cos(4x) + 4x^3", color=GREEN)
        self.play(Write(final_deriv))
        self.wait(3)

        # Summary
        summary = Tex("Key Concepts:", color=BLUE)
        point1 = Tex("1. Chain Rule: dy/dx = dy/du * du/dx", color=YELLOW)
        point2 = Tex("2. Apply to composite functions", color=YELLOW)
        point3 = Tex("3. Break down complex derivatives", color=YELLOW)

        summary_group = VGroup(summary, point1, point2, point3).arrange(DOWN, buff=0.3)

        self.play(FadeOut(prob2_title), FadeOut(func2), FadeOut(final_deriv))
        self.play(Write(summary_group))
        self.wait(4)

        self.wait(1)  # Total duration placeholder