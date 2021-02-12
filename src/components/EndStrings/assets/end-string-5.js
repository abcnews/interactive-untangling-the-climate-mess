export const animate = () => {
  return ks
    .animate(
      "#Darktangle-1",
      [
        { p: "opacity", t: [1500, 1875, 2250], v: [1, 0, 1], e: [[3, 1], [3, 1], [0]] },
        {
          p: "strokeDashoffset",
          t: [0, 1500, 2250, 3542],
          v: [4327.1, -400, -400, 4322.3],
          e: [[1, 0, 0, 0.6, 1], [1, 0, 0, 0.6, 1], [1, 0, 0, 0.6, 1], [0]],
        },
        {
          p: "d",
          t: [0, 1500, 2250, 3542],
          v: [
            "path('M343,879C352.7,859.2,383.7,774,284.4,673C185.2,572,196.7,489.9,198.8,459.6C200.1,440.4,198.7,412.5,183.1,400.5C179.8,398,175.8,396.1,171.1,395.3C156.3,392.5,143.9,398.2,129.6,399.6C124.9,400,114.1,400.7,109.5,400.5C96.4,399.8,100.5,387.8,113.6,386.3C127,384.8,149.6,394.2,152.7,411.2C158.5,443.2,123.7,480.9,95.1,466.6C82.7,460.3,73.3,444.8,69.4,427.8C65.7,412.1,66.6,395.2,73.9,383.1C87.9,359.9,124.1,346.7,148.6,355.8C184.8,369.1,155.6,428.6,155.6,459.5C155.6,482.7,174.9,501.1,195.2,499C200,498.5,205.7,494.8,209.6,492C221.7,483.5,230.1,464.8,228,448.7C225.3,427.8,196.6,398,229.8,388.2C234.6,386.8,239.7,386.5,244.7,387C251.4,387.5,258.2,390.6,263.7,394.6C318.4,434.9,237.7,479.9,247,521.3C251.2,539.9,269.2,543.7,284.4,541.7C304.4,539.1,329,511.3,337.9,493.3C342.4,484.2,341.7,473.8,340.8,464C337.7,429.7,302.3,426.1,278.7,437.9C225.4,464.4,221.6,527.1,144,537.2C116.5,540.8,91.5,520.5,82.5,511C66.2,493.9,73.4,472.6,95.1,466.6C120.4,459.6,146.9,461.3,172.2,467.8C181.3,470.1,189.6,479.8,187.8,490.7C184.9,507.9,167.8,521.7,155.6,530.9C142.5,540.7,126.5,552.5,110.1,553.8C89.1,555.4,69.4,545.8,53.9,530.1C34.9,511,22.2,482.8,20.9,455.7C20.2,439.1,20.8,422.1,24.6,406.9C29.5,387.8,39.6,371.5,58.9,362.8C73.6,356.1,81.2,359.6,91.7,357.7C108.4,354.6,125.7,346.6,140,336.7C151.6,328.6,167.7,314.3,176.7,298.1C184.3,284.4,186.9,269.3,178,255.2C160.4,227.4,108.1,241.2,92.4,265.6C81.8,282,89.4,312.5,99.7,326.5C115.6,347.9,143,347.1,162.5,330.9C178.4,317.7,197.2,301.5,217.1,292.7C236.9,283.9,257.8,282.4,278.1,298.5C294.4,311.3,295.5,336.1,279.2,350C268.6,359.2,254.4,362.4,244,371.6C222.6,390.5,211.1,426.7,222.3,455.7C237,493.8,284.8,470.7,305.7,454.5C316.2,446.3,332.2,416.1,346,429.6C364.2,447.3,301.4,484.7,278.1,493.9C267.3,498.2,235.5,508.1,214.7,521.2C194.1,534.2,184.3,550.3,216.5,567.1C225.2,571.7,233.5,575.1,243,576.7C261.7,579.9,281.8,574.2,299.9,563.7C318.5,552.9,335.1,536.8,346,520C352.9,509.3,365.2,484.8,356.3,471.6C345.8,456.1,320.6,460.7,306.9,467.2C264.3,487.1,229.5,501.4,182,495.2C153.5,491.5,136.9,431.3,146.3,406.1C153.4,387.4,174.2,371.5,190.1,363.4C210.6,352.9,230.2,350.6,250.1,357.7C260.8,361.4,273.4,377.8,290.2,389.9C300.4,397.2,312.1,403,325.8,403.5C350.6,404.5,351.1,381.6,366.7,373')",
            "path('M68,884C77.7,864.2,79.7,809,128,688C176.3,567,196.7,489.9,198.8,459.6C200.1,440.4,198.7,412.5,183.1,400.5C179.8,398,175.8,396.1,171.1,395.3C156.3,392.5,143.9,398.2,129.6,399.6C124.9,400,124.6,400.4,119.9,400.2C106.8,399.4,111,387.4,124,386C137.5,384.5,149.6,394.2,152.7,411.2C158.5,443.2,123.7,480.9,95.1,466.6C82.7,460.3,73.3,444.8,69.4,427.8C65.7,412.1,66.6,395.2,73.9,383.1C87.9,359.9,124.1,346.7,148.6,355.8C184.8,369.1,155.6,428.6,155.6,459.5C155.6,482.7,174.9,501.1,195.2,499C200,498.5,205.7,494.8,209.6,492C221.7,483.5,230.1,464.8,228,448.7C225.3,427.8,183.4,414.4,216.6,404.6C221.4,403.2,226.5,402.9,231.5,403.4C238.2,403.9,245,407,250.5,411C305.2,451.3,237.2,473.1,246.6,514.5C250.8,533.1,268.8,536.9,284,534.9C303.9,532.3,328.5,504.5,337.5,486.5C340,479.5,341.7,473.8,340.8,464C337.7,429.7,302.3,426.1,278.7,437.9C225.4,464.4,221.6,527.1,144,537.2C116.5,540.8,91.5,520.5,82.5,511C66.2,493.9,73.4,472.6,95.1,466.6C120.4,459.6,146.9,461.3,172.2,467.8C181.3,470.1,189.6,479.8,187.8,490.7C184.9,507.9,167.8,521.7,155.6,530.9C142.5,540.7,126.5,552.5,110.1,553.8C89.1,555.4,77.5,546.6,62,531C43,511.8,30.3,483.7,29,456.6C28.3,440,28.9,423,32.7,407.8C37.6,388.6,39.6,371.5,58.9,362.8C73.6,356.1,81.2,359.6,91.7,357.7C108.4,354.6,125.7,346.6,140,336.7C151.6,328.6,151.5,331.8,160.5,315.5C168.1,301.9,172.9,287.1,164,273C146.4,245.2,108.2,252.7,92.5,277C81.9,293.4,89.4,312.5,99.7,326.5C115.6,347.9,143,347.1,162.5,330.9C178.4,317.7,193.8,316.3,213.7,307.5C233.5,298.7,254.3,297.3,274.7,313.3C290.9,326.2,295.5,336.1,279.2,350C268.6,359.2,254.4,362.4,244,371.6C222.6,390.5,211.1,426.7,222.3,455.7C237,493.8,272.7,475.6,293.7,459.4C304.1,451.3,320.2,421.1,334,434.5C352.1,452.2,303.4,484.5,280.2,493.7C269.4,498.1,235.5,508.1,214.7,521.2C194.1,534.2,184.3,550.3,216.5,567.1C225.2,571.7,233.5,575.1,243,576.7C261.7,579.9,281.8,574.2,299.9,563.7C318.5,552.9,335.1,536.8,346,520C352.9,509.3,365.2,484.8,356.3,471.6C345.8,456.1,320.6,460.7,306.9,467.2C264.3,487.1,229.5,501.4,182,495.2C153.5,491.5,136.9,431.3,146.3,406.1C153.4,387.4,174.2,371.5,190.1,363.4C210.6,352.9,220.5,352.4,240.5,359.5C251.1,363.3,253.6,382.9,270.5,395C280.7,402.3,292.4,408.1,306.1,408.6C330.8,409.6,331.3,386.7,346.9,378.1')",
            "path('M68,884C77.7,864.2,79.7,809,128,688C176.3,567,196.7,489.9,198.8,459.6C200.1,440.4,198.7,412.5,183.1,400.5C179.8,398,175.8,396.1,171.1,395.3C156.3,392.5,143.9,398.2,129.6,399.6C124.9,400,124.6,400.4,119.9,400.2C106.8,399.4,111,387.4,124,386C137.5,384.5,149.6,394.2,152.7,411.2C158.5,443.2,123.7,480.9,95.1,466.6C82.7,460.3,73.3,444.8,69.4,427.8C65.7,412.1,66.6,395.2,73.9,383.1C87.9,359.9,124.1,346.7,148.6,355.8C184.8,369.1,155.6,428.6,155.6,459.5C155.6,482.7,174.9,501.1,195.2,499C200,498.5,205.7,494.8,209.6,492C221.7,483.5,230.1,464.8,228,448.7C225.3,427.8,183.4,414.4,216.6,404.6C221.4,403.2,226.5,402.9,231.5,403.4C238.2,403.9,245,407,250.5,411C305.2,451.3,237.2,473.1,246.6,514.5C250.8,533.1,268.8,536.9,284,534.9C303.9,532.3,328.5,504.5,337.5,486.5C340,479.5,341.7,473.8,340.8,464C337.7,429.7,302.3,426.1,278.7,437.9C225.4,464.4,221.6,527.1,144,537.2C116.5,540.8,91.5,520.5,82.5,511C66.2,493.9,73.4,472.6,95.1,466.6C120.4,459.6,146.9,461.3,172.2,467.8C181.3,470.1,189.6,479.8,187.8,490.7C184.9,507.9,167.8,521.7,155.6,530.9C142.5,540.7,126.5,552.5,110.1,553.8C89.1,555.4,77.5,546.6,62,531C43,511.8,30.3,483.7,29,456.6C28.3,440,28.9,423,32.7,407.8C37.6,388.6,39.6,371.5,58.9,362.8C73.6,356.1,81.2,359.6,91.7,357.7C108.4,354.6,125.7,346.6,140,336.7C151.6,328.6,151.5,331.8,160.5,315.5C168.1,301.9,172.9,287.1,164,273C146.4,245.2,108.2,252.7,92.5,277C81.9,293.4,89.4,312.5,99.7,326.5C115.6,347.9,143,347.1,162.5,330.9C178.4,317.7,193.8,316.3,213.7,307.5C233.5,298.7,254.3,297.3,274.7,313.3C290.9,326.2,295.5,336.1,279.2,350C268.6,359.2,254.4,362.4,244,371.6C222.6,390.5,211.1,426.7,222.3,455.7C237,493.8,272.7,475.6,293.7,459.4C304.1,451.3,320.2,421.1,334,434.5C352.1,452.2,303.4,484.5,280.2,493.7C269.4,498.1,235.5,508.1,214.7,521.2C194.1,534.2,184.3,550.3,216.5,567.1C225.2,571.7,233.5,575.1,243,576.7C261.7,579.9,281.8,574.2,299.9,563.7C318.5,552.9,335.1,536.8,346,520C352.9,509.3,365.2,484.8,356.3,471.6C345.8,456.1,320.6,460.7,306.9,467.2C264.3,487.1,229.5,501.4,182,495.2C153.5,491.5,136.9,431.3,146.3,406.1C153.4,387.4,174.2,371.5,190.1,363.4C210.6,352.9,220.5,352.4,240.5,359.5C251.1,363.3,253.6,382.9,270.5,395C280.7,402.3,292.4,408.1,306.1,408.6C330.8,409.6,331.3,386.7,346.9,378.1')",
            "path('M343,879C352.7,859.2,383.7,774,284.4,673C185.2,572,196.7,489.9,198.8,459.6C200.1,440.4,198.7,412.5,183.1,400.5C179.8,398,175.8,396.1,171.1,395.3C156.3,392.5,143.9,398.2,129.6,399.6C124.9,400,114.1,400.7,109.5,400.5C96.4,399.8,100.5,387.8,113.6,386.3C127,384.8,149.6,394.2,152.7,411.2C158.5,443.2,123.7,480.9,95.1,466.6C82.7,460.3,73.3,444.8,69.4,427.8C65.7,412.1,66.6,395.2,73.9,383.1C87.9,359.9,124.1,346.7,148.6,355.8C184.8,369.1,155.6,428.6,155.6,459.5C155.6,482.7,174.9,501.1,195.2,499C200,498.5,205.7,494.8,209.6,492C221.7,483.5,230.1,464.8,228,448.7C225.3,427.8,196.6,398,229.8,388.2C234.6,386.8,239.7,386.5,244.7,387C251.4,387.5,258.2,390.6,263.7,394.6C318.4,434.9,237.7,479.9,247,521.3C251.2,539.9,269.2,543.7,284.4,541.7C304.4,539.1,329,511.3,337.9,493.3C342.4,484.2,341.7,473.8,340.8,464C337.7,429.7,302.3,426.1,278.7,437.9C225.4,464.4,221.6,527.1,144,537.2C116.5,540.8,91.5,520.5,82.5,511C66.2,493.9,73.4,472.6,95.1,466.6C120.4,459.6,146.9,461.3,172.2,467.8C181.3,470.1,189.6,479.8,187.8,490.7C184.9,507.9,167.8,521.7,155.6,530.9C142.5,540.7,126.5,552.5,110.1,553.8C89.1,555.4,69.4,545.8,53.9,530.1C34.9,511,22.2,482.8,20.9,455.7C20.2,439.1,20.8,422.1,24.6,406.9C29.5,387.8,39.6,371.5,58.9,362.8C73.6,356.1,81.2,359.6,91.7,357.7C108.4,354.6,125.7,346.6,140,336.7C151.6,328.6,167.7,314.3,176.7,298.1C184.3,284.4,186.9,269.3,178,255.2C160.4,227.4,108.1,241.2,92.4,265.6C81.8,282,89.4,312.5,99.7,326.5C115.6,347.9,143,347.1,162.5,330.9C178.4,317.7,197.2,301.5,217.1,292.7C236.9,283.9,257.8,282.4,278.1,298.5C294.4,311.3,295.5,336.1,279.2,350C268.6,359.2,254.4,362.4,244,371.6C222.6,390.5,211.1,426.7,222.3,455.7C237,493.8,284.8,470.7,305.7,454.5C316.2,446.3,332.2,416.1,346,429.6C364.2,447.3,301.4,484.7,278.1,493.9C267.3,498.2,235.5,508.1,214.7,521.2C194.1,534.2,184.3,550.3,216.5,567.1C225.2,571.7,233.5,575.1,243,576.7C261.7,579.9,281.8,574.2,299.9,563.7C318.5,552.9,335.1,536.8,346,520C352.9,509.3,365.2,484.8,356.3,471.6C345.8,456.1,320.6,460.7,306.9,467.2C264.3,487.1,229.5,501.4,182,495.2C153.5,491.5,136.9,431.3,146.3,406.1C153.4,387.4,174.2,371.5,190.1,363.4C210.6,352.9,230.2,350.6,250.1,357.7C260.8,361.4,273.4,377.8,290.2,389.9C300.4,397.2,312.1,403,325.8,403.5C350.6,404.5,351.1,381.6,366.7,373')",
          ],
          e: [[1, 0.4, 0, 0.6, 1], [1, 0.4, 0, 0.6, 1], [1, 0.4, 0, 0.6, 1], [0]],
        },
      ],
      "#Darktangle-2",
      [{ p: "opacity", t: [1500, 1875, 2250], v: [0, 1, 0], e: [[3, 1], [3, 1], [0]] }],
      { autoremove: false, markers: { 1: 0, "1a": 1500, 2: 2250 } }
    )
    .range(0, 3542);
};

export default animate;