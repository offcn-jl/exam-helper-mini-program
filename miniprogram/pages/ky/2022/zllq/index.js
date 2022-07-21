// pages/ky/2022/zllq/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bookTypeList: [],
        bookList: [
            {
                "type": "政治历年试题集锦",
                "name": "18-22政治试题与答案",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658312453888-8612030e-c6de-4064-a6f8-f317a929797c.pdf"
            },
            {
                "type": "英语历年试题集锦",
                "name": "18-22英语（一）试题与答案",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658312418882-27292715-049d-49bb-8e1f-757402cdfd8e.pdf"
            },
            {
                "type": "英语历年试题集锦",
                "name": "18-22英语（二）试题与答案",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658312359362-8cad3774-1fa4-474c-ae6d-e2f872b7ac79.pdf"
            },
            {
                "type": "数学历年试题集锦",
                "name": "2021年数学一试题",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658312318100-8d151dc6-75ec-4f13-9fb6-a207881ab4a8.pdf"
            },
            {
                "type": "数学历年试题集锦",
                "name": "2021年数学一解析",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658312293974-6dbac81b-91c8-412e-aedc-e3c91a377e6d.pdf"
            },
            {
                "type": "数学历年试题集锦",
                "name": "2021年数学三试题",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658312281313-844a250b-e90f-42eb-98e0-d3945ac9eb72.pdf"
            },
            {
                "type": "数学历年试题集锦",
                "name": "2021年数学三解析",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658312234766-73274105-539d-4757-8daf-e05eead75f82.pdf"
            },
            {
                "type": "数学历年试题集锦",
                "name": "2021年数学二试题",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658312210370-60c83f76-7410-420a-a970-b8e34e18f47b.pdf"
            },
            {
                "type": "数学历年试题集锦",
                "name": "2021年数学二解析",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658312187024-ceb7909e-db12-4871-a179-64fff888f8b0.pdf"
            },
            {
                "type": "数学历年试题集锦",
                "name": "2020年数学一试题",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658312158410-df149d12-292b-4202-afbc-c1578c72822b.pdf"
            },
            {
                "type": "数学历年试题集锦",
                "name": "2020年数学一解析",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658312129571-1e77a35c-7bf1-4ccb-bba4-59c17234d65d.pdf"
            },
            {
                "type": "数学历年试题集锦",
                "name": "2020年数学三试题",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658312073126-db76fe81-5d6f-4b47-82eb-ba09c4e33c80.pdf"
            },
            {
                "type": "数学历年试题集锦",
                "name": "2020年数学三解析",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658312039689-af721c34-e9ad-4c51-a668-2b75704443e4.pdf"
            },
            {
                "type": "数学历年试题集锦",
                "name": "2020年数学二试题",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658312003524-9e256155-c3c1-49b3-be23-411d4feb3052.pdf"
            },
            {
                "type": "数学历年试题集锦",
                "name": "2020年数学二解析",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658311958677-da8e8b30-7305-4322-ab2a-d245ea5f9bd4.pdf"
            },
            {
                "type": "数学历年试题集锦",
                "name": "2019年数学一试题",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658311918906-f9d9a2c2-b1d1-42ed-a2ed-410f4a7c53bf.pdf"
            },
            {
                "type": "数学历年试题集锦",
                "name": "2019年数学一解析",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658311876437-f37004e5-cd5f-4a25-b3ce-f99878feb75d.pdf"
            },
            {
                "type": "数学历年试题集锦",
                "name": "2019年数学三试题",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658311843716-a5a3538f-b134-448a-9a06-113000ba5536.pdf"
            },
            {
                "type": "数学历年试题集锦",
                "name": "2019年数学三解析",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658311806292-5cb619ec-d8a2-4b43-8a16-15d967bccd75.pdf"
            },
            {
                "type": "数学历年试题集锦",
                "name": "2019年数学二试题",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658311778399-33861654-e78e-4615-9820-04f91cbe12f4.pdf"
            },
            {
                "type": "数学历年试题集锦",
                "name": "解析2019年数学二",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658311757688-e89bd766-3c78-4886-973a-4c417d0aa373.pdf"
            },
            {
                "type": "数学历年试题集锦",
                "name": "2018年数学一试题",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658311727177-c7291010-3e5a-4fbb-82f5-e0ab9ffcb328.pdf"
            },
            {
                "type": "数学历年试题集锦",
                "name": "2018年数学一解析",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658311716510-80dd8622-2726-41fc-9463-89eb69c9c40c.pdf"
            },
            {
                "type": "数学历年试题集锦",
                "name": "2018年数学三试题",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658311652657-c9eeb94a-9a5a-4f30-898f-c5277c1686d2.pdf"
            },
            {
                "type": "数学历年试题集锦",
                "name": "2018年数学三解析",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658311631133-7d4ad80e-efc2-4f95-92d4-7f834beb4686.pdf"
            },
            {
                "type": "数学历年试题集锦",
                "name": "2018年数学二试题",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658311605766-f11d43f1-1fd7-4dcd-b8ee-09257ca35deb.pdf"
            },
            {
                "type": "数学历年试题集锦",
                "name": "2018年数学二解析",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658311578192-66d73139-cac7-4793-9d43-833cabea0ffe.pdf"
            },
            {
                "type": "政治思维导图",
                "name": "哲学逻辑图-唯物史观",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658311472175-68cc126a-d1fa-490c-b8e5-f4b987f3e998.pdf"
            },
            {
                "type": "政治思维导图",
                "name": "哲学逻辑图-认识论",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658311456160-968863df-b371-4c5b-90c4-2e4ec2085c07.pdf"
            },
            {
                "type": "政治思维导图",
                "name": "哲学逻辑图-辩证法",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658311416082-bf3ea3c6-a953-4f67-a3cb-cdd9244165c0.pdf"
            },
            {
                "type": "政治思维导图",
                "name": "哲学逻辑图-唯物论",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658311354293-488185ea-53e4-4534-94ec-7a8d5b98b638.pdf"
            },
            {
                "type": "政治思维导图",
                "name": "思修法基-理想篇",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658310857534-f879eea3-aa85-4072-b48e-bc44d2e02dad.pdf"
            },
            {
                "type": "政治思维导图",
                "name": "思修法基-法律篇框架梳理",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658310814721-ee6809ba-636e-4173-9d65-69c9aa8d6d75.pdf"
            },
            {
                "type": "政治思维导图",
                "name": "史纲-重要会议梳理",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658310786992-4c8dab04-32ec-49a8-856e-f39ac7d1e47f.pdf"
            },
            {
                "type": "政治思维导图",
                "name": "史纲-土地政策总结",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658310746231-f15764b4-da9e-49d6-97e1-5c292a2d9406.pdf"
            },
            {
                "type": "政治思维导图",
                "name": "史纲-毛泽东著作总结",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658310709679-ff0cf0f1-68e5-4420-aacd-0236c5b87976.pdf"
            },
            {
                "type": "政治思维导图",
                "name": "史纲框架梳理",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658310675917-c751a8ef-6bab-4eaa-bdb9-3dad527b8662.pdf"
            },
            {
                "type": "政治思维导图",
                "name": "毛中特框架梳理",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658310651537-71bf7a4e-9908-4ba8-9403-33cb9b0fb7b9.pdf"
            },
            {
                "type": "政治思维导图",
                "name": "马原梳理框架",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658310626915-54ee27fc-a644-4308-9ea6-54a2108bd8c6.pdf"
            },
            {
                "type": "政治思维导图",
                "name": "道德梳理",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658310559686-c195d3f9-3f0e-4b96-af2b-078f1c2fe018.pdf"
            },
            {
                "type": "政治思维导图",
                "name": "哲学部分思维导图超强记忆及考点辨析",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658310491745-9b1a0480-1cc2-4fa7-b812-1efe697043d1.pdf"
            },
            {
                "type": "政治思维导图",
                "name": "思法逻辑框架图",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658310474243-49c399c7-87bb-4581-8dda-050784b8dd66.pdf"
            },
            {
                "type": "政治思维导图",
                "name": "史纲逻辑导图",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658310431667-94fc721b-6103-4981-b5ea-b62b892d36c3.pdf"
            },
            {
                "type": "政治思维导图",
                "name": "毛中特思维导图",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658310300852-2fd97a6a-072b-4cba-89c7-f68865ee0679.pdf"
            },
            {
                "type": "政治思维导图",
                "name": "马原哲学逻辑导图",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658310226136-23ce2584-899f-4918-97fa-ba373114291b.pdf"
            },
            {
                "type": "英语3000词汇",
                "name": "英语3000词（中）",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658310143815-127f7c03-afc8-4e48-b96f-ad3d59dcde23.pdf"
            },
            {
                "type": "英语3000词汇",
                "name": "英语3000词（下）",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658310085365-b54ce22a-185d-4a93-a3ee-c310021b2e19.pdf"
            },
            {
                "type": "英语3000词汇",
                "name": "英语3000词（上）",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658310003206-61bf0181-89d3-4a01-90c0-50b3905a22d9.pdf"
            },
            {
                "type": "题型题量复习指导",
                "name": "考研政治：近两年国家线变化表",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658309937247-aac57955-23e2-4b0b-8a5d-f9162821a4c4.pdf"
            },
            {
                "type": "题型题量复习指导",
                "name": "考研政治：各章节复习备考建议",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658309908222-488488c8-3117-4b69-be95-6a1ae38feba4.pdf"
            },
            {
                "type": "题型题量复习指导",
                "name": "考研政治：八大常考题型的解答公式",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658309884603-ff9525b2-1889-4225-8cd5-540e52df1809.pdf"
            },
            {
                "type": "题型题量复习指导",
                "name": "考研英语：英语一考查题型及备考建议",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658309857996-8cf733bc-a3a2-4423-8fe1-299e01dda400.pdf"
            },
            {
                "type": "题型题量复习指导",
                "name": "考研英语：英语一近两年国家线变化表",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658309834435-8e76c70e-e6e2-43b0-898f-eaad62703e15.pdf"
            },
            {
                "type": "题型题量复习指导",
                "name": "考研英语：英语二考查题型及备考建议",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658309800229-4100c10c-07cb-4482-a807-21c4e5fa338d.pdf"
            },
            {
                "type": "题型题量复习指导",
                "name": "考研英语：英语二近两年国家线变化表",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658309761020-5cb47386-52d8-4dce-9573-684c20448b8a.pdf"
            },
            {
                "type": "题型题量复习指导",
                "name": "考研数学：数学一二三难度分析及备考建议",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658309733611-8fd45e71-d67a-48cb-bdbc-9ef6579513c7.pdf"
            },
            {
                "type": "题型题量复习指导",
                "name": "考研数学：数学一二三考试题型及分值比例",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658309702226-21a75790-8739-4a52-9fbc-b7589b83731d.pdf"
            },
            {
                "type": "题型题量复习指导",
                "name": "23 考研政治：各题型及分值详细分析",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658309678428-ede520c6-76c7-4719-b61b-968ccaa44210.pdf"
            },
            {
                "type": "热门专业备考指导",
                "name": "中医复习指导",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658309543697-022d9fa6-cbf6-4652-9263-506130158de4.pdf"
            },
            {
                "type": "热门专业备考指导",
                "name": "音乐与舞蹈学复习指导",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658309403407-7d27e8df-1b9d-4438-a81d-8819c8772fba.pdf"
            },
            {
                "type": "热门专业备考指导",
                "name": "新闻与传播复习指导",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658309141255-d8afe53d-249c-43b3-9c72-7a669970410d.pdf"
            },
            {
                "type": "热门专业备考指导",
                "name": "心理学复习指导",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658309065690-3d67fdca-23de-4bcd-af33-1d0561347ed0.pdf"
            },
            {
                "type": "热门专业备考指导",
                "name": "戏剧与影视学复习指导",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658308966449-9873d99a-b659-4721-abd6-ec2410780386.pdf"
            },
            {
                "type": "热门专业备考指导",
                "name": "体育学复习指导",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658308920591-cded1e30-4277-4487-8e03-9587d46f4d1d.pdf"
            },
            {
                "type": "热门专业备考指导",
                "name": "设计学复习指导",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658308855784-ee9605c2-04a3-477a-b11c-6921e3225748.pdf"
            },
            {
                "type": "热门专业备考指导",
                "name": "美术学复习指导",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658308817602-320ec9fc-cef4-422e-88c4-b03216d54915.pdf"
            },
            {
                "type": "热门专业备考指导",
                "name": "临床西医复习指导",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658308792670-0be81c04-555b-4ad8-a777-e9b8247f584a.pdf"
            },
            {
                "type": "热门专业备考指导",
                "name": "经济学复习指导",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658308741472-c4cb6d8a-b63a-427f-bd2d-988db8ae1fe8.pdf"
            },
            {
                "type": "热门专业备考指导",
                "name": "金融硕士复习指导",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658308688418-9fc9a79c-c135-44a5-82ec-0c9370a034a7.pdf"
            },
            {
                "type": "热门专业备考指导",
                "name": "教育学复习指导",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658308638436-6f9da2fb-776a-4a0e-86cc-487bb72aad51.pdf"
            },
            {
                "type": "热门专业备考指导",
                "name": "计算机复习指导",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658308606159-1a26d92e-3d60-4fee-b5a5-c176564fcd36.pdf"
            },
            {
                "type": "热门专业备考指导",
                "name": "护理学复习指导",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658308578113-18ef4451-ff43-444c-93f4-fac8bed6cc46.pdf"
            },
            {
                "type": "热门专业备考指导",
                "name": "管理学复习指导",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658308539333-3e84c7c8-4740-4c7e-8ad0-a6300066c2c5.pdf"
            },
            {
                "type": "热门专业备考指导",
                "name": "翻译硕士复习指导",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658308482616-aaf6ec2a-546b-48e1-87ba-4f60eb7090ac.pdf"
            },
            {
                "type": "热门专业备考指导",
                "name": "法硕复习指导",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658308445061-a11d180c-a225-49ba-b20c-5228a62c6265.pdf"
            },
            {
                "type": "热门专业备考指导",
                "name": "MPAcc复习指导",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658308401955-31704cac-2c22-4af7-9405-e72939c2aa54.pdf"
            },
            {
                "type": "专业课试题",
                "name": "中医统考专硕307试题",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658308350169-3b2a62e1-133c-4239-b17b-964a7e564e9c.pdf"
            },
            {
                "type": "专业课试题",
                "name": "新闻与传播热门院校试题集锦",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658308325374-2568f607-8b5e-4ee7-9519-9b461ab7df1d.pdf"
            },
            {
                "type": "专业课试题",
                "name": "心理学热门院校试题集锦",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658308287342-61098227-629e-4463-ad20-461321e3a5e8.pdf"
            },
            {
                "type": "专业课试题",
                "name": "体育硕士热门院校试题集锦",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658308272999-b845e310-2328-4355-af14-55373db738bc.pdf"
            },
            {
                "type": "专业课试题",
                "name": "社会工作热门院校试题集锦",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658308246040-b94f755c-bfa6-4b4c-a6fc-46f92c03a34c.pdf"
            },
            {
                "type": "专业课试题",
                "name": "历年西医综合试题集锦",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658308209053-91e4d7b7-2d6a-4d67-9bd1-4b108721a7ef.pdf"
            },
            {
                "type": "专业课试题",
                "name": "经济学热门院校试题集锦",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658308175662-3005a31b-0161-464a-8645-6c5ed70a3839.pdf"
            },
            {
                "type": "专业课试题",
                "name": "金融学综合热门院校试题集锦",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658308141332-3910fedd-8e48-4355-9a67-6d0d94755c81.pdf"
            },
            {
                "type": "专业课试题",
                "name": "教育学热门院校试题集锦",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658308107603-4c4d7321-93f6-4e2a-8df8-5e3a8d36e2b0.pdf"
            },
            {
                "type": "专业课试题",
                "name": "汉硕热门院校试题集锦",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658308083922-4c570702-1ca2-4b15-a6c2-eb7561f9df23.pdf"
            },
            {
                "type": "专业课试题",
                "name": "管理学热门院校试题集锦",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658308048659-8c85caae-0699-47ad-8376-3489e3a20496.pdf"
            },
            {
                "type": "专业课试题",
                "name": "法硕热门院校试题集锦",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658308021231-b24e2abd-1142-4805-bc37-9cc0d079d507.pdf"
            },
            {
                "type": "精研笔记",
                "name": "政治院长笔记",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658307972269-d5a51fba-f5a5-4ea7-bf00-e34db9842b68.pdf"
            },
            {
                "type": "精研笔记",
                "name": "英语院长笔记",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658307931489-28589c54-7d05-49d7-9973-e25017b96341.pdf"
            },
            {
                "type": "精研笔记",
                "name": "数学院长笔记",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658307888577-27f7fb16-518a-4c26-b88a-a87dc47cd9db.pdf"
            },
            {
                "type": "精研笔记",
                "name": "逻辑院长笔记",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658307861493-d269b806-758f-4985-bc7c-394aabd1d9ff.pdf"
            },
            {
                "type": "精研笔记",
                "name": "初数院长笔记",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658307801260-d37718e2-e242-4903-b5fa-38b706117592.pdf"
            },
            {
                "type": "数学思维导图",
                "name": "线代第5讲：相似",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658307691454-32146a4d-6249-4738-836e-a2fdbe775417.pdf"
            },
            {
                "type": "数学思维导图",
                "name": "线代第4讲：向量组",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658307678271-874200f5-53ce-4dde-a304-68c4a85d8362.pdf"
            },
            {
                "type": "数学思维导图",
                "name": "线代第3讲：线性方程组",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658307587396-ff224c0e-313b-46fe-af04-49390f968edc.pdf"
            },
            {
                "type": "数学思维导图",
                "name": "线代第2讲：矩阵",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658307557505-63651152-39b7-4292-827b-8b98b87087c6.pdf"
            },
            {
                "type": "数学思维导图",
                "name": "线代第1讲：行列式",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658307527411-1450fe8d-d15f-40e2-b336-f1443b6427bd.pdf"
            },
            {
                "type": "数学思维导图",
                "name": "高数第8讲：无穷级数",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658307490501-1a38de5c-8c6b-4ce9-8a0d-fb5570834fe2.pdf"
            },
            {
                "type": "数学思维导图",
                "name": "高数第7讲：微分方程",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658307464268-10e6465c-74bc-4f7f-bfbb-9f0a37279c0e.pdf"
            },
            {
                "type": "数学思维导图",
                "name": "高数第6讲：二重积分【数二、数三】",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658307429425-4a727487-546b-4827-87d0-32edc1c485ba.pdf"
            },
            {
                "type": "数学思维导图",
                "name": "高数第5讲：多元函数积分学【数一】",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658307408181-de851f98-ad06-48c3-a78f-6193c0350238.pdf"
            },
            {
                "type": "数学思维导图",
                "name": "高数第4讲：多元函数微分",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658307375128-a5269af0-e0ec-48de-81fb-bd8438ab5e63.pdf"
            },
            {
                "type": "数学思维导图",
                "name": "高数第2讲：一元函数微分",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658307341613-e6dcd379-1e9a-4a28-a218-b51137bc56b3.pdf"
            },
            {
                "type": "数学思维导图",
                "name": "概率第5讲：大数定律和中心极限定理",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658307292565-4421537e-3b6e-4c50-aeb9-8773901fb97e.pdf"
            },
            {
                "type": "数学思维导图",
                "name": "概率第4讲：数字特征",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658307210743-6e2d916b-57d3-45c2-8b5b-75cddd272c4c.pdf"
            },
            {
                "type": "数学思维导图",
                "name": "概率第3讲：多维随机变量及其分布",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658307112566-3d44e369-f68d-4dc1-b1de-980d3d38d4b3.pdf"
            },
            {
                "type": "数学思维导图",
                "name": "概率第2讲：一维随机变量及其分布",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658307085718-ca7df919-24c4-4c84-85ad-0229efbdc3a1.pdf"
            },
            {
                "type": "数学思维导图",
                "name": "概率第1讲：随机事件与概率",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658306782967-522de5c3-2e8a-4dc5-996e-8ad27376b48d.pdf"
            },
            {
                "type": "23备考手册",
                "name": "23考研备考手册",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658306658335-94574202-989d-4a6f-826d-af23694c4031.pdf"
            },
            {
                "type": "英语思维导图",
                "name": "长难句",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658306490835-173f0260-5654-458e-9ffc-77e420cadf6a.pdf"
            },
            {
                "type": "英语思维导图",
                "name": "阅读六大题型",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658306441945-272b5702-a142-4bfb-b9fb-431475568e2d.pdf"
            },
            {
                "type": "英语思维导图",
                "name": "语法-思维导图",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658306407330-46b2b35a-69ab-466b-a06c-abe5e985f1d2.pdf"
            },
            {
                "type": "英语思维导图",
                "name": "完形填空-思维导图",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658306371518-cee17ccd-bb7e-4d46-9ea0-d4bebef88dbe.pdf"
            },
            {
                "type": "英语思维导图",
                "name": "翻译方法-思维导图",
                "link": "https://static.kaoyan365.cn/production/book/doc/1658305744861-82cf18bf-5e12-4628-a5ed-c058464ca5db.pdf"
            }
        ],
        bookList4Show: [],

        scrollItemActiveIndex: 0,

        suffix: {}, // 后缀
        suffixStr: "", // 后缀 字符串

        CRMEFSID: "24c7164ed31bbad4539d2ecc604335aa", // CRM 活动表单 ID
        CRMRemark: "", // CRM 注释

        phone: "", // 用户手机号码
        openid: "", //openid
    },

    // 手动检查 SSO 登录状态
    SSOCheckManual: function () {
        getApp().methods.SSOCheckManual({
            crmEventFormSID: this.data.CRMEFSID,
            suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr },
            remark: this.data.CRMRemark,
            callback: ({ phone, openid }) => {
                this.setData({ phone, openid });
                wx.showToast({ title: '领取成功，点击下方资料即可查看', icon: "none" });
            },
        });
    },

    // 浏览资料
    view(e) {
        if (!this.data.bookList4Show[e.currentTarget.dataset.index].link) {
            wx.showToast({ title: '配置有误', icon: "none" });
            return
        }
        if (!this.data.phone) {
            wx.showToast({ title: '请您先点击上方按钮进行注册', icon: "none" });
            return
        }
        wx.navigateTo({ url: '../../../book/web-view/index?downloadable=false&link=' + this.data.bookList4Show[e.currentTarget.dataset.index].link });
    },

    // 点击切换 菜单
    scrollItemOnClick(e) {
        const bookList4Show = [];
        this.data.bookList.forEach(value => {
            if (value.type == this.data.bookTypeList[e.currentTarget.dataset.index]) {
                bookList4Show.push(value);
            }
        });
        this.setData({ bookList4Show, scrollItemActiveIndex: e.currentTarget.dataset.index });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 初始化数据
        const bookTypeList = [];
        this.data.bookList.forEach(bookListValue => {
            let has = false;
            bookTypeList.forEach(bookTypeListValue => {
                if (bookTypeListValue == bookListValue.type) {
                    has = true;
                }
            })
            if (!has) {
                bookTypeList.push(bookListValue.type);
            }
        });
        const bookList4Show = [];
        this.data.bookList.forEach(value => {
            if (value.type == bookTypeList[0]) {
                bookList4Show.push(value);
            }
        });
        this.setData({ bookTypeList, bookList4Show });

        wx.showLoading({ title: '加载中' });
        getApp().methods.getSuffix(options).then(res => {
            this.setData(res);
            // 隐藏 loading
            wx.hideLoading();
            // 判断是否是单页模式
            if (wx.getLaunchOptionsSync().scene !== 1154) {
                // 不是单页模式，进行登陆操作
                // 获取登陆状态
                getApp().methods.SSOCheck({
                    crmEventFormSID: this.data.CRMEFSID,
                    suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr },
                    remark: this.data.CRMRemark,
                    callback: ({ phone, openid }) => this.setData({ phone, openid }),
                });
            }
        }).catch(err => {
            // 隐藏 loading
            wx.hideLoading();
            getApp().methods.handleError({ err: err, title: "出错啦", content: '获取后缀失败', reLaunch: true });
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: "2023研究生考试资料领取",
            imageUrl: "https://jl.offcn.com/zg/ty/images/exam-helper-mini-program/ky/zllq/share.jpg",
        }
    },

    /**
     * 用户点击右上角分享 分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: "2023研究生考试资料领取",
        }
    }
})