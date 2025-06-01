---
layout: post
title: Roman Numerals in One Line of Python
category: blog
draft: false
tags: python, math, syntax
---
When I was first learning programming in Python in ninth grade, I would often finish my assignments early. To occupy ourselves til the end of class, my friend and I would invent little programmming challenges. Often, it would be to write a program to do some task in as few lines as possible. It's sort of like [code golf](https://codegolf.stackexchange.com/), but rather than trying to program in the fewest number of characters, you try to write a program in the fewest lines possible. For example, here's a primality test in one line:

```python

(lambda x: x != 1 and all([x//i*i != x for i in range(2, x//2)]))(int(input()))

```

In this post, I'd like to walk through a problem I recently thought of and solved, because I thought the solution was clever and shows some cool concepts. The problem is easy to state; it's to parse a Roman numeral to an integer. But before we get into the challenge, I'll go over Roman numerals in a good deal of syntactic depth, since their subtleties are essential in breaking down why the challenge is interesting.

## Roman Numerals

Roman numerals are a hybrid positional-tally numeral system invented by the Romans and still sometimes used today for things like the numbers on clocks, the Super Bowl, and centuries (but not years) in Italian. There are seven letters: $\mathbf{I}$, $\mathbf{V}$, $\mathbf{X}$, $\mathbf{L}$, $\mathbf{C}$, $\mathbf{D}$, and $\mathbf{M}$, corresponding to the numbers (in decimal) $1$, $5$, $10$, $50$, $100$, $500$, and $1000$ respectively.^[In Roman numerals, they correspond to the numbers $\mathbf{I}$, $\mathbf{V}$, $\mathbf{X}$, $\mathbf{L}$, $\mathbf{C}$, $\mathbf{D}$, and $\mathbf{M}$, respectively.]

If Roman numerals were a pure tally system, the total number would be got by summing the numbers of each letter in a numeral together, and there would be no other restrictions on the form of the numeral. Any number could be written in Roman numerals in a number of ways; not only through permuting the letters, i.e. $\mathbf{VIII} = \mathbf{IIVI}$, but the same number could be got through different additions, like $\mathbf{V}=\mathbf{IIIII}$ or $\mathbf{X}= \mathbf{VIIIII} = \mathbf{IIIIIIIIII}$. But there indeed are other rules, which, when combined, restrict the Roman numeral representation of any number into being unique. Let me first give the restrictions in terms of three rules:

__Ordering rule:__ In a valid Roman numeral, letters are ordered, left to right, greatest to least.

The next rule limits the amount of times a letter can appear in the numeral, since with repeated appearances, the numeral can be simplified by substituting with a larger letter.

__Rule of repetition:__ Each of the letters $\mathbf{V}$, $\mathbf{L}$, and $\mathbf{D}$ may be present only once in the numeral, while $\mathbf{I}$, $\mathbf{X}$,$\mathbf{C}$, and $\mathbf{M}$, may each appear three times.

The final rule, subtractive notation---the _en passant_ of Roman numerals---is an exception to both of the above rules. It allows a letter be interpreted as subtracting from the total rather than adding to it, in some cases where it reduces the amount of letters needed to represent a numeral. For instance, the $\mathbf{I}$ in $\mathbf{IV}$ is subtractive, and the numeral is shorter than the alternative $\mathbf{IIII}$. I'll state the rule as follows:

<!-- __Subtractive notation:__ If a Roman letter is $\mathbf{I}$, $\mathbf{X}$, or $\mathbf{C}$, then it may appear to the left of a larger letter, if that letter is five or ten times greater, and that letter is itself the rightmost instance of that letter in the numeral. Also, that (the right) letter can be the fourth instance in the numeral if it is $\mathbf{X}$, $\mathbf{C}$, or $\mathbf{M}$, and the (left) letter may appear no other times. Then, the letter is read as subtracting from the right letter, or from the total. -->
__Subtractive notation:__ In situtations where a Roman numeral were to be written with four $\mathbf{I}$'s, $\mathbf{X}$'s, or $\mathbf{C}$'s, those letters can be substituted for subtractive notation, which writes the letter in front of another which is either 5 or 10 times greater, meaning to subtract from it. Then, that (the subtracted-from) letter can be the fourth instance in the numeral if it is $\mathbf{X}$, $\mathbf{C}$, or $\mathbf{M}$, but no other instance of it can occur if it is $\mathbf{V}$, $\mathbf{L}$, or $\mathbf{D}$.

I want to write these rules in a precise way that I can later translate into code. To do that, let's introduce the notation $L$ as the set of all characters, and $L_R = \\{\mathbf{I}, \mathbf{V}, \mathbf{X}, \mathbf{L}, \mathbf{C}, \mathbf{D}, \mathbf{M}\\}$ the subset of $L$ of letters which appear in Roman numerals. A string is an ordered _list_ of letters. As a list, rather than a set, letters may appear multiple times. To define a string $S$ in a set-theoretic way, we can create an idea of letters vs. letter-values, which I'll denote $l$ and $l^\star$. Now if $l \in S$, for instance $l$ being the fifth letter in $S$, $l^\star$ is it's letter-value, perhaps $\mathbf{V}$. As an ordered list, a comparator $<_S$ exists for letters in $S$, so that $l_1 <_S l_2$ if $l_1, l_2 \in S$ and $l_1$ is further to the left in $S$. The character-interpretting function $f:L_R\mapsto \mathbb{Z}$ is

$$
f(l^\star) = \begin{cases}
    1 & \text{ if } l^\star = \mathbf{I},\\
    5 & \text{ if } l^\star = \mathbf{V},\\
    10 & \text{ if } l^\star = \mathbf{X},\\
    50 & \text{ if } l^\star = \mathbf{L},\\
    100 & \text{ if } l^\star = \mathbf{C},\\
    500 & \text{ if } l^\star = \mathbf{D},\\
    1000 & \text{ if } l^\star = \mathbf{M}.
\end{cases}
$$

Let $\mathcal S$ be the set of all strings, and $\mathcal R \subset \mathcal S$ be the subset of validly formatted Roman numerals. Define the function $F:\mathcal R \mapsto \mathbb{Z}$ to be the function which interprets validly formatted Roman numerals into integers. We can now specify Roman numerals precisely. Below I've given a definition that I believe best fit Roman numerals if it were considered a tally-only system. My definition of a tally system is one where each  letter is considered separately and the total numeral is found by summing the number represented by each letter. I'll call this Specification #1, because afteward I will give another accounting of Roman numerals following the positional idea.

<!-- __Specification #1.__ A Roman numeral $R\in \mathcal S$ is validly formatted ($R \in \mathcal R$) if one of the following hold for every letter $l \in R$. Then, we can assign $\tau_l\in \mathbb{Z}$ and $F(R) = \sum_{l\in R} \tau_l$.
- For all $r\in R$ such that $r <_R l$, $f(r^\star) \geq f(l^\star)$. For all $r\in R$ such that $l <_R r$, $f(r^\star) \leq f(l^\star)$. $\vert \\{r\in R \vert r <_R l \text{ and } r^\star = l^\star \\} \vert \leq 2$ if $l^\star \in \\{\mathbf{I}, \mathbf{X}, \mathbf{C}, \mathbf{M}\\}$, otherwise $\\{r\in R \vert r <_R l \text{ and } r^\star = l^\star \\} = \emptyset$. Then, $\tau_l = f(l^\star)$.
- $l^\star \in \\{\mathbf{I}, \mathbf{X}, \mathbf{C}\\}$. There exists $r\in R$ such that there is no $s\in R$ with $l <_R s <_R r$, and $f(r^\star)/f(l^\star) = 5$ or $f(r^\star)/f(l^\star) = 10$. Then, $\tau_l = -f(l^\star)$. 
- There exists $r\in R$ such that there is no $s\in R$ with $r <_R s <_R l$, and $f(r^\star) < f(l^\star)$. For all $m\in R$ with $m <_R l$ and $m \neq r$, $f(m^\star) \geq f(l^\star)$. For all $m\in R$ such that $l <_R m$, $f(m^\star) < f(l^\star)$. Then, $\tau_l = f(l^\star)$. -->

__Specification #1.__ A Roman numeral $R\in\mathcal S$ is validfly formatted ($R \in\mathcal R$) if there exists a partition of $R$ into three sets $N$, $P$, and $Q$ so that the following hold. 
- $l, s \in P\cup Q$ with $l <_R s \implies f(l^\star) \geq f(s^\star)$. Further, if $l\in Q$, $l <_R s \implies f(l^\star) > f(s^\star)$.
- For $z\in \\{\mathbf{I}, \mathbf{X}, \mathbf{C}, \mathbf{M}\\}$, $\vert\\{l \in P \vert l = z \\}\vert \leq 3$ and $\vert\\{l \in Q \vert l = z\\}\vert \leq 1$.
- For $z \in \\{\mathbf{V}, \mathbf{L}, \mathbf{D} \\}$, $\vert\\{l \in P\cup Q \vert l = z\\}\vert \leq 1$
- For $l, s \in N$, $l^\star = s^\star \implies l = s$.
- For each $l\in N$, $l^\star \in \\{\mathbf{I}, \mathbf{X}, \mathbf{C}\\}$. There exists a $q\in Q$ so that there is no $r\in R$ with $l <_R r <_R q$. Further, $f(q^\star)/f(l^\star) = 5$ or $f(q^\star)/f(l^\star) = 10$. There is no $r\in R$ with $l^\star = r^\star$ or $f(r^\star)/f(l^\star) = 5$.


Then, $F(R) = \sum_{l \in R\cup Q}$ $f(l^\star) - \sum_{l \in N}$ $f(l^\star)$.

The above is...messy.^[The mathematically polite version of "messy" is "involved".] The difficulty is in constraining the ordering of the letters, and handling subtractive notation. To that end, I separated all letters into sets depending on if it is subtractive ($N$), nonsubtractive, ($P$), or subtracted-from ($Q$), (like the $\mathbf{V}$ in $\mathbf{IV}$). The first bullet point is the ordering rule, the second and third are the rule of repetition, and the final two account for subtractive notation. Notice that this definition is given in terms of parsing a numeral for validity and assigning it a value. It does not (easily) show how to construct a valid numeral from an integer. Also notice that the bulk of the definition concerns weeding out invalid numerals, and determining the value of a valid numeral is fairly easy; it only requires determining whether any letter is in $N$ or $P\cup Q$, and following the formula for $F(R)$. Still, for completeness sake, we need a way to construct Roman numerals, for which I'll employ the fact that the Roman numerals can be (better) understood as a positional, compound system. Let's examine the first 10 Roman numerals:

$$ \mathbf{I} \quad \mathbf{II} \quad \mathbf{III} \quad \mathbf{IV} \quad \mathbf{V} \quad \mathbf{VI} \quad \mathbf{VII} \quad \mathbf{VIII}\quad \mathbf{IX}\quad \mathbf{X} $$

These numerals could be got by applying Specification #1. Now, let's multiply each numeral by 10.

$$ \mathbf{X} \quad \mathbf{XX} \quad \mathbf{XXX} \quad \mathbf{XL} \quad \mathbf{L} \quad \mathbf{LX} \quad \mathbf{LXX} \quad \mathbf{LXXX} \quad \mathbf{XL} \quad \mathbf{C} $$

Notice that by multiplying by 10, we have shifted the letters $\mathbf{I}\rightarrow \mathbf{X}$, $\mathbf{V}\rightarrow \mathbf{L}$, $\mathbf{X}\rightarrow \mathbf{C}$, but the pattern remains the same. Multiplying by 10 again, the Roman numerals for 100-1000 are

$$ \mathbf{C} \quad \mathbf{CC} \quad \mathbf{CCC} \quad \mathbf{CD} \quad \mathbf{D} \quad \mathbf{DC} \quad \mathbf{DCC} \quad \mathbf{DCCC} \quad \mathbf{CM} \quad \mathbf{M} $$

^[It's commonly claimed that efficient multiplication of Roman numerals must use the [Egyptian multiplication algorithm](https://en.wikipedia.org/wiki/Ancient_Egyptian_multiplication). When you notice this fact though, it's obvious that standard, base-10 long multiplication can be done on Roman numerals.] I'll call the [compound symbols](https://en.wikipedia.org/wiki/Compound_(linguistics)) above, Roman digits. A Roman digit is itself a valid Roman numeral, but all other Roman numerals are produced by composing Roman digits together. So, 354 is $\mathbf{CCCLIV}$, with $\mathbf{CCC}$ being the symbol for 300, $\mathbf{L}$ being the symbol for 50, and $\mathbf{IV}$ being the symbol for 4. 

Specification #2 uses Roman digits. Define the symbolic matrix

$$
A = \begin{bmatrix}
\mathbf{I} & \mathbf{V} & \mathbf{X}\\
\mathbf{X} & \mathbf{L} & \mathbf{C}\\
\mathbf{C} & \mathbf{D} & \mathbf{M}\\
\mathbf{M} & - & -
\end{bmatrix}.
$$

We'll index $A$, for convenience, with zero-indexing, so that $A_{00}=\mathbf{I}$, $A_{01}=\mathbf{V}$, etc. The final row is incomplete because no Roman letter is assigned to 5000 or 10,000. However, $\mathbf{MM}$ and $\mathbf{MMM}$ are still used for 2000 and 3000. Therefore, the largest defined Roman numeral is 3999, being $\mathbf{MMMCMXCIX}$. I'll define the generic Roman digits as

$$ G^i_j =
\begin{cases}
    A_{i0} & \text{ if } j = 1,\\
    A_{i0}A_{i0} & \text{ if } j = 2,\\
    A_{i0}A_{i0}A_{j0} & \text{ if } j = 3,\\
    A_{i0}A_{i1} & \text{ if } j = 4,\\
    A_{i1} & \text{ if } j = 5,\\
    A_{i1}A_{i0} & \text{ if } j = 6,\\
    A_{i1}A_{j0}A_{i0} & \text{ if } j = 7,\\
    A_{i1}A_{i0}A_{j0} & \text{ if } j = 8,\\
    A_{i0}A_{i2} & \text{ if } j = 9.\\
\end{cases}
$$

Now we can give Specification #2.

__Specification #2.__ A Roman numeral $R\in \mathcal S$ is valid ($R\in \mathcal R)$, if there exists a partition of $R$ into four sets $D_0$, $D_1$, $D_2$, $D_3$, with the following holding.
 - For $i'$, $i''$, $l'\in D_{i'}$, $l'' \in D_{i''}$, then $i' < i'' \implies l'' <_R l'$. 
 - For each $i$, there is some $j_i$ so that $D_i = G^i_{j_i}$, or $D_i=\emptyset$. If that is the case, define $j_i=0$.

Then $F(R) = \sum_{i=0}^3 j_i 10^i$.

When I first learned Roman numerals, maybe in third grade, I think something like Specification #1 (the restricted tally system) came to my mind, and if you haven't spent as much time thinking about Roman numerals as I have since then, maybe it is also what you think of. I think it's a serviceable definition when dealing with numbers in the clock-to-Super Bowl range, but is mentally taxing for larger numbers. Specification #2 (the positional compound system) reads Roman digits straight into decimal digits, with less mental math. The most difficult part is determining the boundaries of the Roman digits. Still, hopefully you agree with me that Specification #2 is the easier/more natural way to read Roman numerals. Of course, the two are provably identical, so you could continue with an adherence to Specification #1 if you so desired.

## The program

The goal is to write a program (eventually in one line) that can interpret Roman numerals into the integers; that is, to implement the function $F$. Furthermore, no program is incomplete if can't handle invalid inputs, so the it should recognize incorrectly formatted strings, I'll describe this as $\bar F$. 

$$ 
\bar{F}(R) = \begin{cases}
    F(R) & \text{ if } R \in \mathcal R,\\
    \text{ invalid symbol } & \text{ if } R \not\in \mathcal R.
\end{cases}
$$

If your goal is to reduce the line-count of a program, the key is to (ab)use the python features which let complex things happen in one line. The three most important are listed below. I'll assume that you're passingly farmiliar will provide an example of each but won't give a full description. If you want more information, you can click the links.
 - [List comprehension](https://www.programiz.com/python-programming/list-comprehension)    `[i**2 for i in range(3)] # [0, 1, 4]`
 - [Lambda functions](https://www.programiz.com/python-programming/anonymous-function)      `f = lambda x: x**2 # f(3) outputs 9`
 - [Ternary operator](https://www.dataquest.io/blog/python-ternary-operator/)               `1 if x > 3 else 0`

I'll also use the built in functions `.join()` and `sum()`. Notably absent are loops (while-loops specifically, since for-loops can be approximated with list comprehension), and assignment. 

Now that I've reviewed Roman numerals, how would you go about writing a program to parse them? It's certainly not a hard problem, if you aren't restricted to use only one line. The natural place to start is probably to create an implementation based on either Specifcation #1. Below I've written my idea about programs which follow the flavor of Specification #1 (a tally system), and Specification #2 (a positional system). It's not written especially to minimize line-count, but should show whether pursuing either as an idea is even possible. It works by iterating though each letter and determining its status in $N$, $P$ or $Q$. A string `N` is maintained for letters in $N$; `PQ` is the same for $P\cup Q$, with `isQ` being a boolean list for whether the a letter is in $P$ or $Q$. The rest encodes the necessarily logic described in Specification #1.

^[Obviously, in the one-line challenge, a semicolon counts as a line (or else everything would be trivial), but linebreaks done for readability don't count (or else everything would be unreadable).]
```python

c = 0
v = True
f = lambda x: [1000,500,100,50,10,5,1]['MDCLXVI'.index(x)] if x in 'MDCLXVI' else -1
n = False
N = ""; PQ = ""; isQ = []
R = input()
for i,l in enumerate(R):
    tau = f(l)
    n_ = i < len(R) - 1 and l in "IXC" and f(R[i+1])/tau in (5, 10)
    if(tau == -1):
        v = False; break
    if(n and n_):
        v = False; break
    elif(n_):
        if(l in N):
            v = False; break
        N += l
        c -= tau
    else:
        t = sum([r == l for r in PQ])
        if(((l in "MCXI" and t <= (2 + n)) or 
            (l in "DLV" and t == 0))
            and all([f(r) > tau if isq else f(r) >= tau for r, isq in zip(PQ, isQ)])
            and (n or not any([tau/f(r) in (1, 5) for r in N]))):
            c += tau
            PQ += l
            isQ += [n]
        else:
            v = False; break
    n = n_

print(c if v and c > 0 else "invalid symbol")

```

This doesn't seem promising. There's a bunch of variable updating in a for-loop, break statements, and repeated calls to the function `f`. I don't doubt that the total line count here could be reduced, but getting to one line seems a tough task. Now, let's look at a program I made following Specfication #2. It's structured as two nested for-loops, with the outer for-loop being each Roman digit, and the inner for-loop moving through the numeral to isolate the digit.

```python

c = 0
G = [[],
        [0],
        [0,0],
        [0,0,0],
        [0,1],
        [1],
        [1,0],
        [1,0,0],
        [1,0,0,0],
        [0,2]
]
A = [['I','V','X'],['X','L','C'],['C','D','M'],['M','-','-']]
R = input()
for i in range(3, -1, -1):
    s = ''
    digits = ["".join([A[i][j] for j in g]) for g in G]
    j_i = 0
    for k, l in enumerate(R):
        s += l
        if(not s in digits):
            c += j_i*10**i
            R = R[k:]
            break
        if(s == R):
            c += digits.index(s)*10**i
            R = ""
        else:
            j_i = digits.index(s)
print(c if R == "" and 0 < c < 4000 else "invalid symbol")

```

It's perhaps a bit simpler, but still has a break statement and updating the variable `R` in the loop. I, at least, don't see a path to making the code only one line.

So how do we proceed? The key is to notice the following: the strength of the tally system is in going from numeral $\to$ integer, _when the numeral known to be well-formatted_. If the numeral is validly formatted, it only requires

- iterating through each letter
- determining whether the letter is additive or subtractive by comparing it to the next letter.

That can be done with list comprehension and `sum()`. The issue in the first code was in making it robust against invalidly formatted strings. 

Meanwhile, the strength of the positional system is going from integer $\to$ numeral. It's simply a matter of identifying each base 10 digit with its Roman equivalent, and appending the Roman digits together (remember we can use `.join()`). We can combine the two ideas as so: let $H:\mathcal S\mapsto \mathbb{Z}$ be such that $\left.H\right\vert_{\mathcal R} = F$. In other words,

$$ H(R) = \begin{cases}
F(R) & \text{ if } R\in \mathcal R\\
\text{ anything at all } & \text{ if } R \not\in \mathcal R.
\end{cases} $$ 

Further, let $G: \mathbb{Z} \mapsto S$ be such that $\left.G\right\vert_{\operatorname{Im} F} = F^{-1}$. In other words, 

$$ G(z) = \begin{cases}
F^{-1}(z) & z\in \text{ if } \operatorname{Im} F \,\,\text{(that is, $z\in\\{1,...,3999\\}$) } \\
\text{ invalid symbol } & \text{ if } z \not\in \operatorname{Im} F.
\end{cases} $$ 

Then the following holds:

$$
\bar F(R) = \begin{cases}
H(R) & \text{ if } G(H(R)) = R\\
\text{ invalid symbol } & \text{ otherwise. } 
\end{cases}
$$

Now let's provide the one-line solutions to $H$ and $G$. Given as a lambda function, $H$ is

```python

H = lambda R: sum([(-1 if R[i:i+2] in ['IV','IX','XL','XC','CD','CM'] else 1) * 
                    [1000,500,100,50,10,5,1]['MDCLXVI'.index(l)] if l in 'MDCLXVI' else -1
                    for i, l in enumerate(R)])

```

and $G$ is

```python

G = lambda x: "".join(["".join([
                [],                     # 0
                [A[2]],                 # 1
                [A[2]]*2,               # 2
                [A[2]]*3,               # 3
                [A[2],A[1]],            # 4
                [A[1]],                 # 5
                [A[1],A[2]],            # 6
                [A[1],A[2],A[2]],       # 7
                [A[1],A[2],A[2],A[2]],  # 8
                [A[2],A[0]]]            # 9
                [x//10**(3-i)%10])
                for i, A in enumerate([['-','-','M'],['M','D','C'],['C','L','X'],['X','V','I']])])\
                if 0 < x < 4000 else "invalid symbol"

```

$\bar F$ is composed from $H$ and $G$.

```python

F = lambda R: (lambda HR: HR if G(HR) == R else "invalid symbol")(H(R)) 

```

And finally, we can substitute all the expressions together to get:

```python

(lambda HR, R: HR if "".join(["".join([
                [],                     # 0
                [A[2]],                 # 1
                [A[2]]*2,               # 2
                [A[2]]*3,               # 3
                [A[2],A[1]],            # 4
                [A[1]],                 # 5
                [A[1],A[2]],            # 6
                [A[1],A[2],A[2]],       # 7
                [A[1],A[2],A[2],A[2]],  # 8
                [A[2],A[0]]]            # 9
                [HR//10**(3-i)%10])
                for i, A in enumerate([['-','-','M'],['M','D','C'],['C','L','X'],['X','V','I']])])\
                == R and 0 < HR < 4000 else "invalid symbol")\
                (
                     *(lambda R: (sum([(-1 if R[i:i+2] in ['IV','IX','XL','XC','CD','CM'] else 1) * 
                               [1000,500,100,50,10,5,1]['MDCLXVI'.index(l)] if l in 'MDCLXVI' else -1
                               for i, l in enumerate(R)]), R))(input())
                
                )

```

Voila, we now have a one-line, Roman numeral interpretter. 



![Bob Mortimer I love that sort of thing](https://media1.tenor.com/m/00PC8j1kRhEAAAAd/bob-mortimer-wilty.gif)