---
title: AI-For-Beginners
date: 2023-02-01 17:39:12
permalink: /pages/3a02c1/
categories:
  - 算法与数据结构
tags:
  - 
---
> Microsoft AI-For-Beginners https://github.com/microsoft/AI-For-Beginners

## Different Approaches to AI

If we want a computer to behave like a human, we need somehow to model inside a computer our way of thinking. Consequently, we need to try to understand what makes a human being <font color=#dd0000 size=4>intelligent</font> .

> To be able to program intelligence into a machine, we need to understand how our own processes of making decisions work. If you do a little self-introspection, you will realize that there are some processes that happen subconsciously – eg. we can distinguish a cat from a dog without thinking about it - while some others involve reasoning.

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230202165557.png)

## Symbolic

### Knowledge Representation

One of the important concepts in Symbolic AI is knowledge. It is important to differentiate knowledge from information or data. For example, one can say that books contain knowledge, because one can study books and become an expert. However, what books contain is actually called data, and by reading books and integrating this data into our world model we convert this data to knowledge.

> ✅ Knowledge is something which is contained in our head and represents our understanding of the world. It is obtained by an active learning process, which integrates pieces of information that we receive into our active model of the world.

Most often, we do not strictly define knowledge, but we align it with other related concepts using DIKW Pyramid. It contains the following concepts:

- Data is something represented in physical media, such as written text or spoken words. Data exists independently of human beings and can be passed between people.

- Information is how we interpret data in our head. For example, when we hear the word computer, we have some understanding of what it is.

- Knowledge is information being integrated into our world model. For example, once we learn what a computer is, we start having some ideas about how it works, how much it costs, and what it can be used for. This network of interrelated concepts forms our knowledge.

- Wisdom is yet one more level of our understanding of the world, and it represents meta-knowledge, eg. some notion on how and when the knowledge should be used.

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230202165843.png)

Thus, the problem of knowledge representation is to find some effective way to represent knowledge inside a computer in the form of data, to make it automatically usable. This can be seen as a spectrum:

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230202165925.png)

> On the left, there are very simple types of knowledge representations that can be effectively used by computers. The simplest one is algorithmic, when knowledge is represented by a computer program. This, however, is not the best way to represent knowledge, because it is not flexible. Knowledge inside our head is often non-algorithmic.

> On the right, there are representations such as natural text. It is the most powerful, but cannot be used for automatic reasoning.

Nowadays, AI is often considered to be a synonym for Machine Learning or Neural Networks. However, a human being also exhibits explicit reasoning, which is something currently not being handled by neural networks. In real world projects, explicit reasoning is still used to perform tasks that require explanations, or being able to modify the behavior of the system in a <font color=#dd0000 size=4>controlled</font> way.


## Neural Networks

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230202170129.png)

As we discussed in the introduction, one of the ways to achieve intelligence is to train a computer model or an artificial brain. Since the middle of 20th century, researchers tried different mathematical models, until in recent years this direction proved to by hugely successful. Such mathematical models of the brain are called neural networks.

Sometimes neural networks are called Artificial Neural Networks, ANNs, in order to indicate that we are talking about models, not real networks of neurons.