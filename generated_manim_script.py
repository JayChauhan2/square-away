from manim import *

class Explainer(Scene):
    def construct(self):
        # Step 1: Introduction
        title = Tex("Rolle's Theorem \& Mean Value Theorem", color=BLUE)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        # Step 2: Rolle's Theorem Statement
        rolles_title = Tex("Rolle's Theorem", color=GREEN)
        rolles_conditions = MathTex(
            "f \\text{ continuous on } [a,b]",
            "f \\text{ differentiable on } (a,b)",
            "f(a) = f(b)",
            color=YELLOW
        )
        rolles_conclusion = MathTex(
            "\\exists c \\in (a,b) \\text{ where } f'(c) = 0",
            color=RED
        )

        rolles_title.to_edge(UP)
        rolles_conditions.arrange(DOWN, aligned_edge=LEFT, buff=0.3).next_to(rolles_title, DOWN)
        rolles_conclusion.next_to(rolles_conditions, DOWN, buff=0.5)

        self.play(Write(rolles_title))
        self.wait(0.5)
        self.play(Write(rolles_conditions))
        self.wait(1)
        self.play(Write(rolles_conclusion))
        self.wait(2)
        self.play(FadeOut(rolles_title), FadeOut(rolles_conditions), FadeOut(rolles_conclusion))

        # Step 3: Rolle's Theorem Example
        example_title = Tex("Example: ", "$F(x) = x^2 - 3x + 2$", color=PURPLE)
        axes = Axes(
            x_range=[0, 3, 1],
            y_range=[-1, 2, 1],
            axis_config={"color": WHITE},
        )
        axes_labels = axes.get_axis_labels(x_label="x", y_label="f(x)")

        graph = axes.plot(lambda x: x**2 - 3*x + 2, color=BLUE)
        intercepts = [
            Dot(axes.c2p(1, 0), color=RED),
            Dot(axes.c2p(2, 0), color=RED)
        ]
        intercept_labels = [
            MathTex("x=1").next_to(intercepts[0], DOWN),
            MathTex("x=2").next_to(intercepts[1], DOWN)
        ]

        derivative = MathTex(
            "f'(x) = 2x - 3",
            "f'\\left(\\frac{3}{2}\\right) = 0",
            color=GREEN
        ).to_edge(DOWN)

        self.play(Write(example_title))
        self.wait(1)
        self.play(Create(axes), Write(axes_labels))
        self.play(Create(graph))
        self.wait(1)
        self.play(FadeIn(intercepts[0]), FadeIn(intercepts[1]))
        self.play(Write(intercept_labels[0]), Write(intercept_labels[1]))
        self.wait(1)
        self.play(Write(derivative))
        self.wait(2)
        self.play(FadeOut(example_title), FadeOut(axes), FadeOut(axes_labels),
                  FadeOut(graph), *[FadeOut(dot) for dot in intercepts],
                  *[FadeOut(label) for label in intercept_labels], FadeOut(derivative))

        # Step 4: Mean Value Theorem Statement
        mvt_title = Tex("Mean Value Theorem", color=ORANGE)
        mvt_conditions = MathTex(
            "f \\text{ continuous on } [a,b]",
            "f \\text{ differentiable on } (a,b)",
            color=YELLOW
        )
        mvt_conclusion = MathTex(
            "\\exists c \\in (a,b) \\text{ where }",
            "f'(c) = \\frac{f(b) - f(a)}{b - a}",
            color=RED
        )
        mvt_note = Tex("'mean' = average rate of change", color=PINK).scale(0.7)

        mvt_title.to_edge(UP)
        mvt_conditions.arrange(DOWN, aligned_edge=LEFT, buff=0.3).next_to(mvt_title, DOWN)
        mvt_conclusion.next_to(mvt_conditions, DOWN, buff=0.5)
        mvt_note.next_to(mvt_conclusion, DOWN, buff=0.3)

        self.play(Write(mvt_title))
        self.wait(0.5)
        self.play(Write(mvt_conditions))
        self.wait(1)
        self.play(Write(mvt_conclusion))
        self.wait(1)
        self.play(Write(mvt_note))
        self.wait(2)
        self.play(FadeOut(mvt_title), FadeOut(mvt_conditions),
                  FadeOut(mvt_conclusion), FadeOut(mvt_note))

        # Step 5: Mean Value Theorem Example
        example_title2 = Tex("Example: ", "$f(x) = \\sin x$", " on ", "$[0, \\pi]$", color=TEAL)
        axes2 = Axes(
            x_range=[0, PI, PI/4],
            y_range=[-1, 1, 1],
            axis_config={"color": WHITE},
        )
        axes2_labels = axes2.get_axis_labels(x_label="x", y_label="f(x)")

        sin_graph = axes2.plot(lambda x: np.sin(x), color=GREEN)
        secant_line = axes2.get_secant_slope_group(
            x=0, graph=sin_graph, dx=PI,
            secant_line_color=RED, secant_line_length=5
        )
        c_dot = Dot(axes2.c2p(PI/2, 0), color=YELLOW)
        c_label = MathTex("c = \\frac{\\pi}{2}").next_to(c_dot, UP)

        derivative2 = MathTex(
            "f'(c) = \\frac{\\sin(\\pi) - \\sin(0)}{\\pi - 0} = 0",
            "f'(x) = \\cos x = 0 \\text{ at } x = \\frac{\\pi}{2}",
            color=PURPLE
        ).to_edge(DOWN)

        self.play(Write(example_title2))
        self.wait(1)
        self.play(Create(axes2), Write(axes2_labels))
        self.play(Create(sin_graph))
        self.wait(1)
        self.play(Create(secant_line))
        self.wait(1)
        self.play(FadeIn(c_dot), Write(c_label))
        self.wait(1)
        self.play(Write(derivative2))
        self.wait(2)
        self.play(FadeOut(example_title2), FadeOut(axes2), FadeOut(axes2_labels),
                  FadeOut(sin_graph), FadeOut(secant_line), FadeOut(c_dot),
                  FadeOut(c_label), FadeOut(derivative2))

        # Step 6: Comparison
        comparison = VGroup(
            Tex("Rolle's Theorem:", color=GREEN),
            MathTex("f(a) = f(b) \\Rightarrow f'(c) = 0", color=GREEN),
            Tex("Mean Value Theorem:", color=ORANGE),
            MathTex("f'(c) = \\frac{f(b) - f(a)}{b - a}", color=ORANGE)
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.5)

        self.play(Write(comparison))
        self.wait(2)
        self.play(FadeOut(comparison))

        # Step 7: Conclusion
        conclusion = Tex("Key Takeaways:", color=BLUE)
        points = VGroup(
            Tex("1. Both require continuity and differentiability", color=YELLOW),
            Tex("2. Rolle's is a special case of MVT", color=RED),
            Tex("3. MVT connects local and global behavior", color=PURPLE)
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.3)

        conclusion.to_edge(UP)
        points.next_to(conclusion, DOWN)

        self.play(Write(conclusion))
        self.wait(0.5)
        self.play(Write(points))
        self.wait(3)
        self.play(FadeOut(conclusion), FadeOut(points))

        self.wait(1)