---
title: Contributor development maintenance guide
date: 2023-03-10
author: kiner-tang
zhihu_url: https://zhuanlan.zhihu.com/p/639266384
yuque_url: https://www.yuque.com/ant-design/ant-design/rixou58ogv8hlev2
juejin_url: https://juejin.cn/post/7322305961196273673
---

Hi, I'm [kiner-tang](https://github.com/kiner-tang) who is a heavy user of Ant Design. As the same reason, I come up to be a contributor for fixing bug and some features. Finally, it's my honer to become a member of Ant Design Collaborator.

During the journey from user to contributor, and then from contributor to collaborator, I also encountered many problems. I would like to share my experience with the problem I meet. Hope it can help you to join the Ant Design community.

## Some frequently asked Questions

### About dependent version

There are various of package managers, such as npm, yarn, or pnpm, providing version-locking solutions to avoid version-inconsistencies issue. However, in Ant Design projects, many functions depend on the original components in the `react-component` repository. We expect that when we encounter some bugs, after the `react-component` fixes and releases the patch version, Instead of manually upgrading the version in the Ant Design project, we can install the latest patch installation package only by reinstalling the dependencies. At this point, the version-lock file provided by the package manager is the main obstacle to automatic updates, because once the version-lock file is available, reinstalling the dependency will also install the version specified by the lock file and cannot be upgraded to the patch version.

Based on the above reasons, we adopt the following methods:

1. Add `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml` and other version lock files to `.gitignore` without version tracking.

2. In `package.json`, for the dependencies that we want to update when there is a new patch version, we use `~` description version number to allow patch version update.

```json
{
  "dependencies": {
    "rc-cascader": "~3.9.0"
  }
}
```

For the difference between `^` and `~` in the version description of package.json, see [What's the difference between tilde(~) and caret(^) in package.json](https://stackoverflow.com/questions/22343224/whats-the-difference-between-tilde-and-caret-in-package-json).

Thus, when our dependency such as rc-cascader fixes a bug and releases a patch version such as: `3.9.1`, then the user's latest installed version is `3.9.1`. For the maintainer of Ant Design, we only need to execute the following command:

```bash
git clean -fdx
npm i
```

### Snapshot update problem

In Ant Design, we use Jest for unit test. Many first-time contributors of Ant Design may be confused that CI failed after opening a pull request in which they just modify the text in a demo. This is caused by the snapshot diff test.

In most libraries, idempotence is emphasized. With one method and same parameters, the result should be the same no matter how many times it is executed. In Ant Design, the main use of snapshot test is to verify the idempotence of demos, in order to ensure the stability and certainty of components. Actually, snapshot test is simple. By comparing HTML string generated by each demo in different runnings, we could get which one is broken in PR.

Back to the topic, what should we do if we find snapshot test failed after changing a demo?

1. First, we need to check the snapshot diff to see whether it is the expected change. If there is only the text you modified in demo differs from the origin one, we just need to run the following command to update the snapshot:

   ```bash
   # Run the test command to update snapshot
   npm run test -u
   ```

2. However, we should find what's going wrong if the diff of snapshot is not only caused by your modification this time. For example, you only modified the text, but found that classnames in snapshots have changed, which obviously does not meet expectations.

   The common causes are as follows:

   - Local dependency is out of date. This may happen when you pull the latest code, but did not update the local dependency. Deleting `lock` file, `node_modules`, and then reinstalling dependencies could solve this problem.

     solution is as simple as deleting the lock file、node_modules and reinstall dependencies.

   - Your code not synchronizing baseline code can also result in inconsistent snapshot comparisons. The solution is as simple as pulling the baseline code locally and then rebase your code to the baseline code.

   - You may have locally changed the source code not only in demos, which would cause unexpected change. You need to go through your change carefully.

### rc-x Library dependencies

In Ant Design, most components are an upper encapsulation of a component based on `react-component`. Therefore, if we find a problem of `@rc-component/xxx` or `rc-xxx` component when troubleshooting, we need to open PR on those repositories to fix it. After coding, we need to verify that the problem in Ant Design is resolved, in which case we can link the project to Ant Design for verification. For example:

Run `npm link` in the repo you are working on. ![image](https://user-images.githubusercontent.com/10286961/224603053-98488c2d-f33c-4c25-8c09-6c790cfcdbf6.png)

Run `npm link "Project name"` in Ant Design

![image](https://user-images.githubusercontent.com/10286961/224603065-95715727-83d0-4ef9-81e4-3b7065aaf73e.png)

Once we have verified, we can open PR to the repo. Noted that link may cause exceptions when running the test command. Therefore, we need to run the following commands locally to delete the package from link.

```bash
npm unlink "rc-field-form" --no-save
npm i
```

When the PR is finally merged, usually the maintainers will release a version. If the patch version is released, you only need to install and verify it in Ant Design. But if the minor version is released, you need to upgrade it in Ant Design. After local verification, a separate PR to Ant Design could be opened for bugfix.

### Deprecation

In a large project, if you want to remove a property or a method, it is actually very troublesome. Since your project may already have a lot of items in use, other projects depending on it may get broken. But as the project iterated, we will encounter more and more problems which solutions long time ago may no longer fit. Then, we need to adopt a soft, less radical way to remove it, leaving enough time for users to modify.

In Ant Design, we adopt a **five-step strategic** to deprecate property or method:

1. **Add deprecated tag to the property**

   ![003](https://user-images.githubusercontent.com/10286961/224358324-8f72f2c0-d5bb-4281-9b29-7e2428353449.png)

   After adding the above deprecated tag, we can see warning when using this property:

   ![004](https://user-images.githubusercontent.com/10286961/224358351-958a168d-41de-44b0-8244-2f8d67c4d13a.png)

2. **Add console warnings**

![005](https://user-images.githubusercontent.com/10286961/224358371-09f08f79-8c95-4126-b382-59311bb702d6.png)

It is important that after adding console warnings, we need to add a test case to test whether the warnings will be displayed when the deprecated properties are used.

![006](https://user-images.githubusercontent.com/10286961/224358407-3d89d2f5-b4aa-48b4-aab8-1331a0f620fa.png)

3. **Update document**: The above two steps are mainly to warn developers in the editor and browser. Next, we need to update the related document. Generally speaking, if we have a property deprecated, it means that it is not recommended for users to use. So we need to remove the related document and add the description of the new property in the meantime. If it cannot be deleted due to special circumstances, please specify the version this property is supported and the alternative scheme in the remarks column.

4. **Compatibility between old and new**: Now that we're done with the above tips, it's important to make sure that the new property and the deprecated one both works until the deprecated one is removed. That is to say, we must have the deprecated property work normally. We should not apply any changes in addition to the warning.

   ![007](https://user-images.githubusercontent.com/10286961/224358439-76c42c78-e244-42bd-8935-b08f536931a2.png)

   We can do something like this to make sure that the new property takes precedence over the old one. At this point, our property deprecation work is done.

5. **Remove**: After our properties have been deprecated for a certain period of time, usually when the major version is released, we can remove them. We also need to delete comments, warnings, test cases, and documents that were related to the property. At this point our property removal work is done.

## Take it to the next level

After contributing for some time, we believe you have gained a deeper understanding of Ant Design's overall development process and project architecture. At this point, you may want to take on more tasks and contribute more to the open source community. Then, you can apply to be a Collaborator at Ant Design by commenting on the link below for more active contributors. [Add Collaborator permission for some active contributors](https://github.com/ant-design/ant-design/issues/3222), The Collaborators will then start the voting process, and after passing the voting, they will invite you to officially become a Collaborator at Ant Design.

After you become a newly appointed Ant Design collaborator, you will be assigned some additional rights, such as:

- Tag the issue
- Close the issue
- Free to create branches under the Ant Design project
- Free to merge approved PR

- ...

There are some caveats to this.

### Merge PR

It's time to merge PR! Ant Design uses both squash merge and commit merge in different case which requires attention. Following is some introduction about the difference:

![008](https://user-images.githubusercontent.com/10286961/224358476-2332e36f-0adf-486f-8b17-1b2ad34926aa.jpg)

- **Merge pull request**: Merge the current PR into the target branch normally (usually used when branches merge with each other, and commit records will not be merged. Do not use this when merging PRs, otherwise too many redundant commit records will be added to the target branch).
- **Squash and merge**: Merge the commit record into one and merge it into the target branch (this is usually used for merging PRs).
- **Rebase and merge**：When you want to adjust the baseline

Merge in Ant Design requires at least one collaborator's approve. Collaborator who approved should ensure PR are fully reviewed and confirm.

### Identify XY Problems

During routine maintenance, some issues can easily reproduce but some others are not. Report sometimes get stuck in XY problem which makes requirement or bug question strange to understand. Thus, before resolving the superficial problems, we should dig into the real question.

- [X-Y PROBLEM](https://xyproblem.info/)

## Epilogue

Hoping that more and more contributors and collaborators will join us to build a more efficient and elegant Ant Design.