import { Paragraph } from './Paragraph';

export const Blog = () => {
  return (
    <section className="mb-6" aria-labelledby="blog-heading">
      <h2 id="blog-heading" className="sr-only">
        About this visualization
      </h2>

      <Paragraph>
        This visualization shows the linear predictor and response spaces for the current GLM settings,
        illustrating the true and estimated curves, sampled observations, and how link and distribution
        choices change predicted responses—adjust the controls to explore parameter effects and the
        resulting data-generating process.
      </Paragraph>

      <Paragraph className="italic text-sm">
        Tip: use the controls to change sample size, link function, and distribution to observe how
        estimates and variability respond.
      </Paragraph>
    </section>
  );
};

export default Blog;
// ...existing code...
