---
layout: post
title: "Landau Notation: A user's guide"
category: blog
draft: false
tags: math, explainer
---


Big O notation, and it's cousin little o, probably occupy a fuzzy space in the minds of most engineers -- a thing you've heard about and seen used; maybe you can even write down and interpret equations with them. Still, it's not something that you *get*. There's still some hesitancy in the imprecision which seems baked into the idea of "approximating" a function -- like your cheating someone and hoping you don't get caught. I think this has a lot to due with the ad-hoc way it's taught. My first experiences with seeing Landau notation in engineering school was that the professor would write down something on the board:

\begin{equation}\label{first eq}
    y = e^{-x}\sin(x) + O\left(\frac{1}{x}\right)
\end{equation}

Upon writing this, a confused silence would fill the classroom. Where did this $O$ thing come from? Was it a function defined earlier in the lecture (or earlier in the semester), that the students, half-asleep, had forgotten about? Eventually, some student would ask what was going on with the last term. *Oh, that term*, the professor would say, *is the term we don't care about*. And, to further allay the our fears, *It is small.* The professor would then continue with the lecture, always discussing more the "important" term $e^{-x}\sin(x)$, and letting $O\left(\frac{1}{x}\right)$ be. 

The overall effect is that students leave the lecture questioning what just happened. How can a term just *be small* (read: unimportant)? Aren't all terms needed to make an equality, and so all are equally important? Also, is $O$ a function or what? Things seem too wishy-washy for what actual math should be. In the example above, I used a real-variable $x$, but computer scientists can probably also relate to similar experiences in analyzing algorithmic complexity. ("So the program takes $O(n^2)$ long to execute, but not exactly?")

In this blog, then, I'd like to spend some time getting to know this notation. I'll talk not only about the definition, but also what it *means*, in a few different interpretations, so that we can build up the intuition to manipulate expressions with with Landau notation (that's the collective name for big O and little o), with confidence. Finally, I'll show collect equivalent definitions of big O  and little o, and prove their equivalence.

Let's start with a list of what Landau notation is, and a longer list of what Landau notation isn't.

Landau notation is:
* A way to compare the limiting behavior of functions.
* A way to describe the growth or decay of a function.

Landau notation isn't:
* A function.
* A measure of algorithmic complexity (exclusively).
* A measure of how functions grow or diminish as the input goes to infinity (exclusively).
* A way to put exact bounds on a function.
* *an equality*.

That last one might be shocking, but as I'll show, it's inarguably true. To do that though, we have to get into the nitty-gritty. Let's jump in.
## The (first) definition

__Definition # 1__. [Big O] Let $f(x)$ be a function defined on some subset of the real (or complex) numbers, and $g(x)$ be a "comparison function" defined on the same domain. If there is a constant $C$ such that 

$$ |f(x)| \leq C|g(x)|, \text{ for all $x$},$$

then we write

$$ f(x) = O(g(x))$$

read, "$f(x)$ is big O of $g(x)$." 

__Example__. $\sin(x)x^2 = O(x^2)$ because we can chose $C=1$ and

$$ |\sin(x)x^2| \leq |\sin(x)||x^2| \leq 1\cdot|x^2|. $$

__Example__. Consider $n$ to be an natural number greater than or equal to 1. Then $n^2 = O(n^3)$ with $C=1$ since

$$ |n^2| = 1\cdot |n^2| \leq |n||n^2| = |n^3|. $$

Well, so far this seems pretty easy, but one ingredient is still missing. Big O is normally used to describe the limiting behavior of a function, normally going to $0$ or $\infty$, but the definition shown above has nothing to do with limits! It only states that the absolute value of the function has an upper bound everywhere. To get the effect of limiting, we place a bound for where we consider the inequality to hold. Just like how $C$ is not something we care to specify, the exact limits of the bound aren't that important; we only care that they exist. Now, let's provide the big O definition with a limiting value of $0$ and $\infty$.

__Definition #2__. [Big O as $x\to\infty$] Let $f(x)$ be a function defined on an subset of the real (or complex) numbers, unbounded above, and $g(x)$ be a "comparison function" defined on the same domain. If there exists constants $x_0$ and $C$ such that

$$ |f(x)| \leq C|g(x)| \text{ for all $x \geq x_0$}, $$

then we write

$$|f(x)| = O(g(x)) \text{ as } x\to\infty.$$

__Definition #3__. [Big O as $x\to 0$] Let $f(x)$ be a function defined on a subset of the real numbers, and $g(x)$ be a "comparison function" defined on the same domain. If there exists constants $x_0$ and $C$ such that

$$ |f(x)| \leq C|g(x)| \text{ for all $|x| \leq x_0$}$$

then we write

$$|f(x)| = O(g(x)) \text{ as } x\to 0.$$

Here, "as $x\to\infty$" or "as $x\to 0$" are qualifier statements: they describe the domain where the inequality holds. You can also see that we describe this as the "limiting behavior", but no limits are actually used. That is to say, if $x_0 = 1$ (in either definition), there's no reason to keep moving closer to $0$ or $\infty$. What is true, is that repeated unions of bounds produces another bound of the same form. That is the essential fact about big O, which allows us to compose functions and expressions with big O together, and produce other functions and expressions with big O. In other words, this is what lets us create an algebra of big O.

__Example__. $1 + x^2 = O(x^2)$ as $x\to \infty$. Take $x_0 = 1$, $C = 2$. Then,

$$ |1 + x^2| = x_0 + x^2 \leq x + x^2 \leq x^2 + x^2 = 2x^2 = 2|x^2|. $$

But $1 + x^2 \neq O(x^2)$ as $x\to 0$. To see this, assume for contraction that two such $x_0$ and $C$ exist. Then we take $x=\frac{x_0}{\sqrt{1+Cx_0^2}}$, which, $C$ being greater or equal to $0$, is less than $x_0$. The contradiction forms as

$$ 1 + x^2 = 1 + \left(\frac{x_0}{\sqrt{1+Cx_0^2}}\right)^2 = 1 + \frac{x_0^2}{1+Cx_0^2} = \frac{1 + Cx_0^2}{1+Cx_0^2} + \frac{x_0^2}{1+Cx_0^2} = \frac{1 + (C+1)x_0^2}{1+Cx_0^2} > \frac{Cx_0^2}{1+Cx_0^2} = Cx^2 $$

Often, the qualifier is dropped when the when the interpretation is 'implied'. This is no doubt the cause of some of the confusion regarding the notation. In general, when analyzing algorithm growth, "as $x\to\infty$" is meant, whereas when expanding Taylor series, "as $x\to 0$" is meant. If you're still confused which one you are dealing with in any situtation, ask yourself which is true: $x=O(x^2)$ or $x^2 = O(x)$. The first, $x=O(x^2)$, is true as $x\to\infty$, while the second, $x^2 = O(x)$, is true as $x\to 0$. 

Let's move now to little o. Just like big O, it has different definitions as a limit to $\infty$ and as a limit to $0$. I'll go in the opposite order as I did for big O, first showing the definition for $\infty$, then $0$, then uniting the two.

__Definition #4__. [Little o as $x\to \infty$] Let $f(x)$ be a function defined on an unbounded subset of the real (or complex) numbers, and $g(x)$ be a "comparison function" defined on the same domain. If, for every $\epsilon > 0$, there is some $x_0$ so that

$$ |f(x)| \leq \epsilon|g(x)| \text{ for all } x \geq x_0 $$ 

then we write

$$f(x) = o(g(x)) \text{ as } x\to\infty.$$

read, "$f(x)$ is little o of $g(x)$ as $x$ goes to $\infty$."

__Definition #5__. [Little o as $x\to 0$] Let $f(x)$ be a function defined on a subset of the real (or complex) numbers, and $g(x)$ be a "comparison function" defined on the same domain. If, for every $\epsilon > 0$, there is some $\delta > 0$ such that

$$ f(x) < \epsilon g(x) \text{ for all $x$ with $|x| < \delta$} $$ 

then we write

$$ f(x) = o(g(x)) \text { as } x\to 0. $$

What's different here? We've replaced the value $C$, which must satisfy the inequality for only one value, with $\epsilon$, which must satisfy the inequality for all positive values. The second value, $x_0$ or $\delta$ depending, depends on $\epsilon$, so that as $\epsilon$ gets smaller, $x_0$ would get bigger in the first definition and $\delta$ would get smaller in the second definition. But what's great is that unlike big O, these are actual limits! To the actual values of $\infty$ and $0$. So in general we can write the definition of little o as:

__Definition #6__. [Little o] For a chosen $a$, $f(x) = o(g(x))$ as $x\to a$, if

$$ \lim_{x\to a}\left|\frac{f(x)}{g(x)}\right| = 0.$$

Where $a$ can be any real number or $\pm\infty$.

I'll show how this is true in slow-motion in the final section.

The interpretation here is that big O acts as "less than or equal to" and little o acts as "strictly less than", in terms of order of growth (or decay). We'll now include one more definition, which is more of a notation than a definition.

__Definition #6__. \[Notation\] If $f(x) - g(x) = O(h(x))$, then we can also write $f(x) = g(x) + O(h(x))$. Likewise, if $f(x) - g(x) = o(h(x))$ as $x\to a$, then we can also write $f(x) = g(x) + o(h(x))$ as $x\to a$.

We now have something that looks like eqn. \eqref{first eq}, and can answer why it isn't in fact, an equality. From the very beginning, the equality was only notational; In effect, defn. #1 doesn't define $O(\cdot)$, but "$=O(\cdot)$". Read allowed, we say f(x) *is* O(g(x)), not f(x) *equals* O(g(x)). Graham, Knuth, and Patashnik describes the sense of this "is" as in the sentence "A bird is an animal." That does not mean "bird = animal", but that "bird" is in the class of "animal." (See also that textbook for a longer discussion about the history of the notation, and why we're stuck with this abuse of notation.) Likewise, $f(x)= O(g(x))$ is in the class of functions which behave asymtotically, like (or less than) $g(x)$. 

## Manipulating Landau notation

I wouldn't blame you if you got a slight headache looking at the proof that $1 + x^2 \neq O(x^2)$. It's a mess, and isn't the point of notation like this to make our life easier, not harder? The real power of Landau notation is that it allows us to manipulate these asymptotic expression a lot like algebraic terms, while making our life easier -- because we can suppress those limiting values, $x_0$ and $C$.

From the definition, it can be seen that the following hold for big O:

\begin{equation}\label{big O rule 1}
    f(x) = g(x) \implies f(x) = O(g(x)) \quad \text{(or $f(x) = O(f(x))$)}
\end{equation}

\begin{equation}\label{big O rule 2}
    f(x) = O(g(x)) \text{ and } g(x) = O(h(x)) \implies f(x) = O(h(x))
\end{equation}

and the following holds for little o:

\begin{equation}\label{little o rule 1}
    f(x) = o(g(x)) \text{ and } g(x) = o(h(x)) \implies f(x) = o(h(x)) \text{ as } x \to a.
\end{equation}

This draws out the comparison of big O to $\leq$ and little o to $<$. Eqn. \eqref{big O rule 1} corresponds to the rule that $x \leq x$, and eqns. \eqref{big O rule 2} and \eqref{little o rule 1} correspond the transitive property of inequalities:

$$ x < y \text{ and } y < z \implies x < z $$ 

$$ x \leq y \text{ and } y \leq z \implies x \leq z $$

Next, I'd like to introduce two more rules which follow from the definition, and will be important when simplifying the order of a complicated function:

\begin{equation}\label{big O rule 3}
    f(x) = O(ag(x)) \implies f(x) = O(g(x))
\end{equation}

\begin{equation}\label{big O rule 4}
    f(x) = O(g(x)) \text{ and } h(x) = O(k(x)) \implies f(x)h(x) = O(g(x)h(x))
\end{equation}

And likewise for little o:

\begin{equation}\label{little o rule 2}
    f(x) = o(ag(x)) \implies f(x) = o(g(x)) \text{ as } x \to a
\end{equation}

\begin{equation}\label{big o rule 3}
    f(x) = o(g(x)) \text{ and } h(x) = o(k(x)) \implies f(x)h(x) = o(g(x)h(x)) \text{ as } x \to a.
\end{equation}

Up to this point, I've been deliberately abstract in keeping our functions as the generic $f(x)$ and $g(x)$. In real examples, $g(x)$ is some standard function like $x^n$, $\log(x)$, or $e^x$. These standard functions form an "ordering," where we can bound the growth of one of these functions below the growth of another:

$$ \log\log x = o(\log x) \text{ as } x\to\infty $$

$$ \log x = o(x) \text{ as } x\to\infty$$

$$ x^n = o(x^{n+1}) \text{ as } x\to\infty$$ 

$$ x^n = o(e^x) \text{ as } x\to\infty.$$

Typically the $x\to 0$ case only considers polynomials, so the essential rule is:

$$ x^n = o(x^{n-1}) \text{ as } x\to 0.$$

All of the above also hold for $O$, since it is a weaker condition. With just these rules, we can work examples to analyze the order of a function.

__Example__. Let $f(x) = \frac{4x^3 + 3x}{x^2 + 1}$. We wish to determine its $O$-order in terms of a monomial as $x\to \infty$. First, notice that for $x>1$, $4x^3 + 3x < 7x^3$, and for $x > 0$, $\frac{1}{x^2 + 1} < \frac{1}{x^2}$. Since we are restricting from below by any value, $1$ and $0$ here, is allowed. By eqn. \eqref{big O rule 4}, we get

$$ \frac{4x^3 + 3x}{x^2 + 1} = O\left(7x^3\frac{1}{x^2}\right) \text{ as } x\to\infty$$

$$ \frac{4x^3 + 3x}{x^2 + 1} = O\left(7x\right) \text{ as } x\to\infty $$

And by eqn. \eqref{big O rule 3},

$$ \frac{4x^3 + 3x}{x^2 + 1} = O\left(x\right) \text{ as } x\to\infty $$

Of course, it's also true that $f(x) = O(x^2)$, but when analyzing function asymptotics, we want the strongest possible bound, at least if we can get it. After working through a few examples, you'll notice some shortcuts. I've listed some important ones in the lemmata below:

__Lemma__. If $f(x) = O(g(x))$ and $h(x) = O(k(x))$, and also $g(x) = O(k(x))$, then

\begin{equation}
    f(x) + g(x) = O(k(x)).
\end{equation}

The next lemma specifies the previous lemma to polynomials.

__Lemma__. If a polynomial $p(x) = \sum_{i=l}^m c_ix^i$, then

$$ p(x) = O(x^l) \text{ as } x \to 0 $$

and 

$$ p(x) = O(x^m) \text{ as } x \to \infty.$$

__Lemma__. If $p(x) = \sum_{i=l}^m c_ix^i$ is a polynomial and $q(x) = \sum_{i=n}^p c_ix^i,$, then

$$ \frac{p(x)}{q(x)} = O(x^{l-n}) \text{ as } x \to 0 $$

and 

$$ \frac{p(x)}{q(x)} = O(x^{m-p}) \text{ as } x \to \infty.$$

## Extending the algebra

As I've tried to emphasize, Landau notation is a way to work with limiting behavior algebraicly. But we still have not unlocked the full power of Landau. For instance, if the following holds,

\begin{equation}\label{manip step 1}
    f(n) = \frac{1}{4}n^3 + O(n) \text{ as } n \to \infty,
\end{equation}

the rules from above would let us deduce that

\begin{equation}\label{manip step 2}
    \frac{f(n)}{n} = \frac{1}{4}n^2 + O(1) \text{ as } n \to \infty.
\end{equation}
It would nice to include the middle step between eqns. \eqref{manip step 1} and \eqref{manip step 2}.

\begin{equation}\label{middle step}
    \frac{f(n)}{n} = \frac{1}{n}\left(\frac{1}{4}n^3 + O(n)\right) \text{ as } n \to \infty
\end{equation}

But such an expression is not allowable from the rules established in the previous sections. The problem is that we have never defined what a term like $\frac{1}{n}O(n)$ means. One solution would be to patch big O with another notational rule:

__Definition #7__. [Speculative notation]. If

\begin{equation}
    h(x)^{-1}\left(f(x) - g(x)\right) = O(p(x))
\end{equation}

then we may write

\begin{equation}
    f(x) = g(x) + h(x)O(p(x))
\end{equation}
Likewise, if

\begin{equation}
    h(x)^{-1}\left(f(x) - g(x)\right) = o(p(x)) \text{ as } x\to a
\end{equation}

then we may write

\begin{equation}
    f(x) = g(x) + h(x)o(p(x)) \text{ as } x\to a.
\end{equation}

Adding this notation could work, if we only care about fixing the issue eqn. \eqref{middle step}. But it wouldn't resolve all issues that could exist; perhaps the $O$ could be nested deep within a complicated expression, each type of expression requiring its own notational definition. To allow full movement of $O$ algebraicly, we need a stronger scheme, which will come from the class-membership idea. I'll quote here from Concrete Mathematics, which explains the concept better than I could.

"From a strictly formal point of view, the notation $O(g(n))$ does not stand for a single function $f(n)$, but for the *set* of all functions $f(n)$ such that $\|f(n)\| \leq C \|g(n)\|$ for some constant $C$. An ordinary formula $g(n)$ that doesn't involve $O$-notation stands for the set containing a single function $f(n)=g(n)$. If $S$ and $T$ are sets of functions of $n$, the notation $S+T$ stands for the set of all functions of the form $f(n) + g(n)$, where $f(n)\in S$ and $g(n)\in T$; other notations like $S-T$, $ST$, $S/T$, $\sqrt{S}$, $e^S$, and $\ln S$ are defined similarly. Then an "equation" between such sets of functions is, strictly speaking, a *set inclusion*; the '=' sign really means '$\subset$'. These formal definitions put all of our $O$ manipulations on firm logical ground."

-- Concrete Mathematics, pg. 446.

__Example__. If $f(x)=O(g(x))$, $f(x) + 1 = 1 + O(g(x))$. That is,

\begin{equation}
\\{f(x) + 1\\} \subset \\{h(x) +1| \text{ there exists } C \text{ such that } |h(x)| \leq C|g(x)| \text{ for all } x \\}.
\end{equation}
Above I'm using set notation. The left side is the set containing the function of $x$ defined as $f(x) + 1$. The right side is the set of all functions $h$ with $h(x) = O(g(x))$, in the sense of defn. #1. The same principle can be used to define any right hand side, and in fact opens up the left hand side into containing $O$ terms as well. 

__Example__. $o(f(x)) = O(f(x))$. This continues the metaphor of $o$ being $<$ and $O$ being $\leq$; being less than implies being less than or equal to.

<!-- The next step is to make $O$ look *more* like a function and make the statement look *more* like an equality. 

By this interpretation, $O$ . There are, as I see it, two views 

1. $O$ 
2. $O(g(x))$ is an actual function (of $x$, not $g(x)$), defined to be whatever is necessary for the equality to hold exactly. In this situation, $O$ may be an actual function, but it's input must be $x$, not $g(x)$. Consider for example

\begin{equation}
    \operatorname{sign}(x)x^2 = O(x^2) \quad \text{ (everywhere).}
\end{equation}

(where $\operatorname{sign}(x)$ is the sign function, $-1$ when $x< 0$ and $1$ when $x\geq 0$.) Taken with the above interpretation, this must also define $O(x^2)$:

\begin{equation}
    O(x^2) = \operatorname{sign}(x)x^2.
\end{equation}

And this would be impossible if $O(x^2)$ were an actual function of $x^2$.

In conclusion, there are three broadening interpretation/definitions of big O 
1. The 'symbolic equals' definition developed in the previous section, where $=O(g(x))$ is defined. 
2. 
3. The 'set inclusion' definition, where $O$ represents 
For the first interpretation -->

## Some other definitions

<!-- The goal of this section is to provide some alternative and equivalent definitions of Landau notation. These definitions are all equivalent, so, following mathematical convention, there's no reason to chose which one is "the most true." -->

First, I promised to explain how the definitions for little o as $x\to\infty$ and $x\to 0$ are both limits and cases of defn. #6. For this, we will need to recall the definition of the limit of a function approaching a real number, and the definition of the limit of a function approaching a infinity.

__Definition #8__. [Real limit] Let $f(x)$ be a function on the real numbers, and $a$ and $L$ be real numbers. If for every $\epsilon > 0$, there exists a $\delta > 0$ so that

$$ |x - a| < \delta \implies |f(x) - L| < \epsilon, $$

then we can write

$$ \lim_{x\to a} f(x) = L $$ 

read, "the limit of $f$ as $x$ approaches $a$ equals $L$."

__Definition #9__. [Infinite limit] Let $f(x)$ be a function on the real numbers, and $L$ be a real number. If for every $\epsilon > 0$, there exists a $x_0 > 0$ so that

$$ x > x_0 \implies |f(x) - L| < \epsilon $$

then we can write 

$$ \lim_{x\to \infty} f(x) = L. $$

Looking at the definition of little o, the two cases are if $a = 0$ (a real number), or $a=\infty$. If $a=0$, then we look to defn. #5, and identify that $L=0$, and $f(x)$ (in defn. #7), is substituted as $\frac{f(x)}{g(x)}$ (in defn. 6). The logical statement from defn. #7 becomes

$$ |x| < \delta \implies \left|\frac{f(x)}{g(x)}\right| < \epsilon. $$

This is the same as saying:

$$ |x| < \delta \implies |f(x)| < \epsilon|g(x)| $$ 

$$ |f(x)| < \epsilon|g(x)| \text{ for all } |x| < \delta. $$

This matches defn. #6 up to an an ultimately inconsequential difference between $\leq$ and $<$.

For the case of $a=\infty$, we now apply the infinite limit. Again, $L=0$ and $f(x)$ (in defn. #8), is substituted as $\frac{f(x)}{g(x)})$ (in defn. #6). The infinite limit becomes:

$$ x > x_0 \implies \left|\frac{f(x)}{g(x)}\right| < \epsilon $$

$$ x > x_0 \implies |f(x)| < \epsilon|g(x)| $$

$$ |f(x)| < \epsilon|g(x)| \text{ for all } x > x_0. $$

This matches defn. #4, again up to the inconsequential difference between $\leq$ and $<$.

<!--
With this interpretation, we retrieve the true 'equality' of the equals sign, at the identical cost of manipulating classes. Still, this interpretation can be liberating, because allows one to do work with $O$ as a more algebraic object, explictly multiplying it (by functions or constants), and including $O$s on both sides of the equality.
-->

 As I showed in the first section, big O isn't really a limit, although people like to think of it that way. A common re-definition of big O uses the limit superior, $\limsup$. To understand this definition, we'll first have to define the limit superior, which is nothing more than the combination of a limit and supremum operator.

__Definition #10__. [$\limsup$]. The limit superior, $\limsup_{x\to a}$, is defined for $a\in \mathbb{R}$ or $a= \pm \infty$. For $a\in \mathbb{R}$, the limit superior is defined as

\begin{equation}
    \limsup_{x\to a} = \lim_{\delta\to 0^+} \sup_{-\delta \leq x-a \leq \delta} f(x).
\end{equation}

For $a=\infty$, the limit superior is defined as

\begin{equation}
    \limsup_{x\to\infty} = \lim_{x_0\to \infty} \sup_{x\geq x_0} f(x).
\end{equation}

and the same for $a=-\infty$, with $x\geq x_0$ changed to $x \leq x_0$. The supremum of a set is the smallest value which is greater or equal to all values in the set. You can think of it as the maximum of the function within the bounds, also including the asymptotes. So for instance

\begin{equation}
    \limsup_{x\to\infty} \sin(x) = 1,
\end{equation}

since for any $x_0$, there is always some $x>x_0$ so that $\sin(x) = 1$. But also

\begin{equation}
    \limsup_{x\to \infty} \frac{x}{1+x} = 1.
\end{equation}

since even though $\frac{x}{1+x}$ never actually achieves 1, that is its asymptotic value. We can now (re)define big O.

__Definition #11__. [Big O]. For the function $f(x)$ comparison function $g(x)$, and $a$ which is either real or $\pm \infty$, we say that $f(x)=O(g(x))$ as $x \to a$, if

\begin{equation}
    \limsup_{x\to a}\left|\frac{f(x)}{g(x)}\right| \text{ exists.}
\end{equation}

This can also be written as
\begin{equation}
    \limsup_{x\to a} \left|\frac{f(x)}{g(x)}\right| < \infty.
\end{equation}

Now we need prove the equivalence of defn. #11 and defn. #3. I will warn you, though, that this proof is technical and uses a couple of results from real analysis. I'll include the proof for $a=0$. The $a=\infty$ case is too similar to bother also including here.

__Proof__. (defn. #3 $\implies$ def.11) Say $f(x)=O(g(x))$ as $x\to 0$ in the defn. #3 sense. Then there exists an $x_0$ and $C$ such that

\begin{equation}
    |f(x)| \leq C|g(x)| \text{ for all } |x| \leq x_0.
\end{equation}
Stated another way, 
\begin{equation}
    \left|\frac{f(x)}{g(x)}\right| \leq C \text{ for all } |x| \leq x_0.
\end{equation}
Take $0 < \delta < x_0$. Then $|x|\leq \delta \implies |x| \leq x_0$, so it also holds that

\begin{equation}
    \left|\frac{f(x)}{g(x)}\right| \leq C \text{ for all } |x| \leq \delta.
\end{equation}

Since $ \|\frac{f(x)}{g(x)}\| $ is bounded from above for $\| x \| \leq \delta$, by a result from analysis, (the least upper bound property), a supremum exists.

\begin{equation}
    \sup_{|x|\leq \delta} \left|\frac{f(x)}{g(x)}\right| \text{ exists for all } 0 < \delta < x_0.
\end{equation}

Now, notice that $\sup_{\|x\|\leq \delta} \|\frac{f(x)}{g(x)}\|$, viewed as a function of $\delta$ must only be decreasing as $\delta \to 0$ (since the bounds only get smaller). By another result of analysis (the monotone convergence theorem), we get that the limit as $\delta \to 0$ exists, and recover the statement of defn. #11.

\begin{equation}
    \lim_{\delta \to 0^+}\sup_{|x|\leq \delta} \left|\frac{f(x)}{g(x)}\right| \text{ exists.}
\end{equation}

(defn. #11 $\implies$ def. #1) Assume that $f(x)=O(g(x))$ in the defn. #11 sense, and let the limit superior be given by a number, $E$. In $\epsilon$-$\delta$ form, the definition says that for any $\epsilon > 0$ there exists a $\delta > 0$ such that

\begin{equation}\label{prf_eq1}
    \delta_0 < \delta \implies \left|\sup_{-\delta_0 \leq x \leq \delta_0} \left|\frac{f(x)}{g(x)}\right| - E \right| < \epsilon.
\end{equation}
We can chose $\epsilon = 1$ and the corresponding $\delta$ so that the above holds. Recalling again that the supremum is decreasing as $\delta \to 0$, we know that

\begin{equation}
    \sup_{-\delta_0 \leq x \leq \delta_0} \left|\frac{f(x)}{g(x)}\right| > E.
\end{equation}

Thus, the absolute value in eqn. \eqref{prf_eq1} can be omitted. Using $\epsilon=1$, we get that

\begin{equation}
    \delta_0 < \delta \implies \sup_{-\delta_0 \leq x \leq \delta_0} \left|\frac{f(x)}{g(x)}\right| < 1 + E.
\end{equation}

The inequality holding at the supremum implies it holds for all $x$ in the bounds

\begin{equation}
    \delta_0 < \delta \implies \left|\frac{f(x)}{g(x)}\right| < 1 + E \text{ for all } -\delta_0 \leq x \leq \delta_0.
\end{equation}

\begin{equation}
    \left|\frac{f(x)}{g(x)}\right| < 1 + E \text{ for all } -\delta < x < \delta.
\end{equation}

Taking $C = 1 + E$ and $x_0=\delta$, we recover the statement of defn. #3 (up to the inconsequential difference between $\|x\| \leq \delta $ and $\|x\|< \delta$).

The proof above looks intimidating, but the intuitive connection between defn. #3 and defn. #11 is easier to describe. While by defn. #3, there exist a threshhold bound $x_0$ and scaling value $C$, where the inequality holds, defn. #11 states (equivalently), that moving towards the limiting value, one eventually reaches a point where the ratio $\|\frac{f(x)}{g(x)}\|$ has a supremum (more importantly: is bounded), for all future values. The overhead in the proof above has to do with the fact that some work has to go into constructing the supremum, even though we only care about its existance. More often, this definition is called upon for the $x\to \infty$ case. I chose to include the $x\to 0$ proof above because my goal in this blog has been to repeatedly emphasize the connection between the $x\to 0$ and $x\to \infty$ case.

I, for one, don't like this limit supremum concept for big O. Limits are a way to represent that an expression gets 'increasingly true,' as we move towards some limiting value. For instance, the limit definition of the derivative

<!-- As I explained in the first section, no limiting is actually occuring in big O. Instead, we have some inequality, including some unknown quantifier $C$, and then place a bound on where this inequality holds, where the domain of the bound is also an unknown qualtifier $x_0$. -->

\begin{equation}
    \lim_{h\to0} \frac{f(x+h)-f(x)}{h} = f'(x)
\end{equation}

expresses that $\frac{f(x+h)-f(x)}{h}$ moves closer and closer to $f'(x)$, as $h$ goes to $0$. This, fundamentally, is not what big O expresses, which states that the inequality holds *exactly*, at some point moving towards the limiting value. The 'moving towards truth' effect of this limit then in effect must be cancelled by the supremum, since in taking the supremum we consider all values within the bound, so already includes the values 'at infinity' (or zero). For all of this added machinery, the final statement is only that this value exists. It seems to me more inelegant than the first definition. Moreover, it is more restricted because it excludes the very valid notion that a function $f(x)$ may be $O(g(x))$ *everywhere*.

Here's another definition which reinterprets the relationship between $f(x)$ and $g(x)$ from multiplication into subtraction, where the difference between the two functions is accounted for by the scaled residual $r(x)$.

__Definition #12__. $f(x) = O(g(x))$ if and only if there is some $r(x)$, $\widetilde{C}$ so that

\begin{equation}\label{def eq}
    g(x) = f(x) + \widetilde{C}r(x),
\end{equation}

and

\begin{equation}\label{def ineq}
    \left|r(x)\right| \leq g(x).
\end{equation}

__Proof__. $\left(\implies\right)$ Let $f(x) = O(g(x))$ with constant $C$. Let $\widetilde C = C + 1$. Define $r(x) = \frac{1}{\widetilde C}\left(g(x) - f(x)\right)$ so that eqn. \eqref{def eq} holds,

$$ \left|r(x)\right| = \left|\frac{1}{\widetilde C}\left(g(x) - f(x)\right)\right| \leq \frac{1}{\widetilde C}\left|g(x)\right| + \frac{1}{\widetilde C}\left|f(x)\right| \leq \frac{1}{\widetilde C}\left|g(x)\right| + \frac{1}{\widetilde C}C |g(x)| = \frac{1+C}{1+C} |g(x)| = |g(x)| $$

$\left(\impliedby\right)$ Let $\widetilde C$, and $r(x)$ satisfy eqns. \eqref{def eq} and \eqref{def ineq}. Then, 

$$ \left| f(x) \right| = \left|g(x) - \widetilde C r(x)\right| \leq \left|g(x)\right| + \widetilde C \left|r(x)\right| \leq \left(\widetilde C + 1\right) g(x). $$

By choosing $C=\widetilde C + 1$, we see that $f(x)=O(g(x))$.

Following the general definition of big O, the definition above doesn't include a limiting value. Inclusion of a limiting value would only change the bounds where eqns. \eqref{def eq} and \eqref{def ineq} hold, with no change to the proof. This definition uses the scaled residual value $\widetilde C r(x)$ in eqn. \eqref{def eq}. An equivalent, unscaled definition is as follows:

__Definition #13__. $f(x) = O(g(x))$ if and only if there is some $\widetilde C$, so that with $r(x)$ being defined from

\begin{equation}
    g(x) = f(x) + r(x)
\end{equation}

and 

$$ |r(x)| \leq \widetilde C g(x). $$

Now, we see that the above definitions rely on the fact that $f(x) = O(g(x))$ if and only if $f(x) - g(x) = O(g(x))$. 

The corresponding 'residual' definition for little o is even easier.

__Definition #14__. $f(x) = o(g(x))$ as $x\to a$ if and only if for $r(x)$ defined from

\begin{equation}
    g(x) = f(x) + r(x)
\end{equation}

it holds that

$$ \lim_{x\to a} \frac{r(x)}{g(x)} = 1. $$

__Proof__. 

$$ \lim_{x\to a} \frac{r(x)}{g(x)} = \lim_{x\to a} \frac{g(x) - f(x)}{g(x)} = \lim_{x\to a} \left(\frac{g(x)}{g(x)} - \frac{f(x)}{g(x)} \right)= \lim_{x\to a} \left(1 - \frac{f(x)}{g(x)} \right) =  1 - \lim_{x\to a} \frac{f(x)}{g(x)}$$

$$ 1 - \lim_{x\to a} \frac{r(x)}{g(x)} = \lim_{x\to a} \frac{f(x)}{g(x)} $$

So the two definitions correspond exactly. (The inclusion of the absolute value in defn. #6 is no big deal.)

## References

In writing this blog I've pulled primarily from Concrete Mathematics (Graham, Knuth, and Patashnik), ch. 9, and always chose their definitions when they conflict with other sources. This textbook is the only one I know of that defines big O first then describes the limiting 'condition' of $x\to 0$ or $x\to \infty$, as I do in defns. 1-3. Other sources define both the inequality and bound in one step.