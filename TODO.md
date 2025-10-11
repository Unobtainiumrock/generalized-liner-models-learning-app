0. Fill out all stubbed components. 

1. Add a set of endpoints about the inner workings of all the features avaialable from this application and provide them as context through prompt templating to the Chat feature, so that users can get highly specific context for navigating how to use the app. We can have direct mappings between questions and answers that execute application workflows for the user. This can give a chat-centric way for them to interact with the application

2. Make the above set up in a way such that these sets of tools are also exposed to potential web agents that visit the site or humans using agentic browsers to execute tasks. See if MCP or A2A is applicable here.

3. Document the system proposed in steps 1 and 2.

4. Verify the logical correctness of things like Knuth's algorithm for Poisson distributions.

5. Hook up the API logic for OpenAI API and ensure that we are securely storing API keys and environment variables.

6. Add in examples of the matrix equation forms for all of the other GLM setups and link function equivalents.

7. Move practical standpoint and advatages/trade-offs of matrices approach to be higher up. Its flow is broken apart by the recent addition of the iterated WLS.

8. Polish up the section on the iterated WLS section.

9. Need to add (t) superscripts to the iterated WLS table for the matrices.

10. Give more attention to the relationship of the variance to the link functions, especially in the iterated WSL table.

11. I noticed that the paths in the top of the react componentes wher files are imported are using relative paths, I would prefer it if we used the @ style of imports with Vite can be used instead.

      { name: 'σ² (variance)', value: 1, min: 0.1, max: 3, step: 0.1 }
12. Why do we have all these default parameters in DistributuonVisualizer.tsx? For example:

{ name: 'λ (rate)', value: 5, min: 0.5, max: 15, step: 0.5 }

is this okay? I know we have sliders in the frontend and maybe these are just default values.

13. The Bernoulli distributiin's histogram (at least for the default values) has some bars go outside the edges of the plot.

14. Need to move the sidebar component that containers sliders, repsonsible for the ControlPanel component s.t. it is instead trasposed and underneath the visualization its actually manipulating. ON SECOND THOUGHT JUST REMOVE THAT SHIT. WE ALREADY HAVE SLIDERS FOR THAT DIRECTLY IN THE BLOG.

15. Inverse Gaussian missing? Maybe add later.